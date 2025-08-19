import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  bool _isLoginView = true;
  String? _notificationMessage;
  bool _isErrorNotification = false;
  Timer? _notificationTimer;

  void _showNotification(String message, {bool isError = false}) {
    _notificationTimer?.cancel();
    setState(() {
      _notificationMessage = message;
      _isErrorNotification = isError;
    });
    _notificationTimer = Timer(const Duration(seconds: 3), () {
      setState(() {
        _notificationMessage = null;
      });
    });
  }

  Future<void> _signIn() async {
    _showNotification("Signing In...");
    try {
      await _auth.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      _showNotification("Login Successful!");
    } on FirebaseAuthException catch (e) {
      String errorMessage;
      switch (e.code) {
        case 'invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'user-not-found':
        case 'wrong-password':
        case 'invalid-credential':
          errorMessage = 'Invalid username or password.';
          break;
        case 'user-disabled':
          errorMessage = 'Your account has been disabled.';
          break;
        case 'too-many-requests':
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 'network-request-failed':
          errorMessage = 'Please check your internet connection.';
          break;
        default:
          errorMessage = 'Invalid username or password.';
      }
      _showNotification(errorMessage, isError: true);
    }
  }

  Future<void> _signUp() async {
    _showNotification("Creating Account...");
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      final user = userCredential.user;
      if (user != null) {
        await _firestore.collection('users').doc(user.uid).set({
          'name': _nameController.text.trim(),
          'email': _emailController.text.trim(),
        });
      }
      _showNotification("Welcome! Account created successfully.");
    } on FirebaseAuthException catch (e) {
      String errorMessage;
      switch (e.code) {
        case 'weak-password':
          errorMessage = 'The password provided is too weak.';
          break;
        case 'email-already-in-use':
          errorMessage = 'An account already exists for that email.';
          break;
        case 'invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'network-request-failed':
          errorMessage = 'Please check your internet connection.';
          break;
        default:
          errorMessage = 'An unknown error occurred. Please try again.';
      }
      _showNotification(errorMessage, isError: true);
    }
  }

  void _submitForm() {
    if (_isLoginView) {
      _signIn();
    } else {
      _signUp();
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _notificationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5FBFE), // --background
      body: Stack(
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth > 800) {
                return _buildWideLayout();
              } else {
                return _buildNarrowLayout();
              }
            },
          ),
          _buildNotificationWidget(),
        ],
      ),
    );
  }

  Widget _buildNotificationWidget() {
    return Align(
      alignment: Alignment.bottomRight,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: _notificationMessage == null ? 0.0 : 1.0,
        child: Container(
          width: 220,
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: _isErrorNotification
                  ? [const Color(0xFFF44336), const Color(0xFFD32F2F)] // --health-red to darker red
                  : [const Color(0xFF29ABE2), const Color(0xFF1A87C2)], // --primary to darker blue
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Text(
            _notificationMessage ?? '',
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildWideLayout() {
    return Row(
      children: [
        Expanded(
          flex: 2,
          child: _buildWelcomePanel(),
        ),
        Expanded(
          flex: 3,
          child: _buildAuthForm(),
        ),
      ],
    );
  }

  Widget _buildNarrowLayout() {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      transitionBuilder: (Widget child, Animation<double> animation) {
        return SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(1.0, 0.0),
            end: Offset.zero,
          ).animate(animation),
          child: FadeTransition(opacity: animation, child: child),
        );
      },
      child: _isLoginView ? _buildWelcomePanel(isNarrow: true) : _buildAuthFormNarrow(isNarrow: true),
    );
  }

  Widget _buildWelcomePanel({bool isNarrow = false}) {
    return Container(
      key: ValueKey('welcome_$_isLoginView'),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF29ABE2), Color(0xFF16A085)], // --primary to --health-green
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      alignment: Alignment.center,
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              FontAwesomeIcons.heartPulse,
              color: Colors.white,
              size: 64,
            ),
            const SizedBox(height: 16),
            Text(
              _isLoginView ? 'New to Appie?' : 'Welcome Back!',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _isLoginView
                  ? 'Sign up and discover a new way to connect.'
                  : 'To keep connected with us please login with your personal info.',
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => setState(() => _isLoginView = !_isLoginView),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 2,
                shadowColor: Colors.black.withOpacity(0.1),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF29ABE2), Color(0xFF1A87C2)], // --primary to darker blue
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Center(
                  child: Text(
                    _isLoginView ? 'SIGN UP' : 'SIGN IN',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuthFormNarrow({bool isNarrow = false}) {
    return Container(
      key: ValueKey('auth_form_$_isLoginView'),
      color: const Color(0xFFF5FBFE), // --background
      alignment: Alignment.center,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: _buildAuthFormContent(isNarrow: isNarrow),
        ),
      ),
    );
  }

  Widget _buildAuthForm({bool isNarrow = false}) {
    return Container(
      key: ValueKey('auth_form_$_isLoginView'),
      color: const Color(0xFFF5FBFE), // --background
      alignment: Alignment.center,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: _buildAuthFormContent(isNarrow: isNarrow),
        ),
      ),
    );
  }

  Widget _buildAuthFormContent({bool isNarrow = false}) {
    return Card(
      color: Colors.white, // --card
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _isLoginView ? 'Sign In to Appie' : 'Create Account',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF29ABE2), // --primary
              ),
            ),
            const SizedBox(height: 16),
            _buildSocialLogins(),
            const SizedBox(height: 16),
            Text(
              'or use your email for ${_isLoginView ? "login" : "registration"}',
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF718096), // --muted-foreground
              ),
            ),
            const SizedBox(height: 24),
            AnimatedSize(
              duration: const Duration(milliseconds: 300),
              child: _isLoginView
                  ? const SizedBox.shrink()
                  : _buildTextField(_nameController, 'Name', Icons.person_outline),
            ),
            if (!_isLoginView) const SizedBox(height: 16),
            _buildTextField(_emailController, 'Email', Icons.email_outlined, isFirstField: _isLoginView),
            const SizedBox(height: 16),
            _buildTextField(_passwordController, 'Password', Icons.lock_outline, isPassword: true),
            const SizedBox(height: 24),
            SizedBox(
              width: isNarrow ? double.infinity : 220,
              child: ElevatedButton(
                onPressed: _submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                  shadowColor: Colors.black.withOpacity(0.1),
                ),
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF29ABE2), Color(0xFF1A87C2)], // --primary to darker blue
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.all(Radius.circular(16)),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Center(
                    child: Text(
                      _isLoginView ? 'SIGN IN' : 'SIGN UP',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            if (isNarrow)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: TextButton(
                  onPressed: () => setState(() => _isLoginView = !_isLoginView),
                  child: Text(
                    _isLoginView ? 'Need an account? Sign Up' : 'Have an account? Sign In',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF29ABE2), // --primary
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialLogins() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildSocialButton(FontAwesomeIcons.google, () {}),
        const SizedBox(width: 16),
        _buildSocialButton(FontAwesomeIcons.facebookF, () {}),
        const SizedBox(width: 16),
        _buildSocialButton(FontAwesomeIcons.linkedinIn, () {}),
      ],
    );
  }

  Widget _buildSocialButton(IconData icon, VoidCallback onPressed) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFFE6F7FA), // --health-blue-light
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: FaIcon(
          icon,
          color: const Color(0xFF29ABE2), // --primary
          size: 20,
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon,
      {bool isPassword = false, bool isFirstField = false}) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      autofocus: isFirstField,
      textInputAction: isPassword ? TextInputAction.done : TextInputAction.next,
      onSubmitted: (_) {
        if (isPassword) {
          _submitForm();
        } else {
          FocusScope.of(context).nextFocus();
        }
      },
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF718096), // --muted-foreground
        ),
        prefixIcon: Icon(icon, color: const Color(0xFF718096)),
        filled: true,
        fillColor: const Color(0xFFE6F7FA), // --health-blue-light
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      style: GoogleFonts.poppins(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: const Color(0xFF2D3748), // --foreground
      ),
    );
  }
}