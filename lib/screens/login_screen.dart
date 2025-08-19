import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // --- All controllers and Firebase instances are unchanged ---
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  bool _isLoginView = true;

  // --- New! State variables to manage our custom notification ---
  String? _notificationMessage;
  bool _isErrorNotification = false;
  Timer? _notificationTimer;

  // Updated! This helper function now shows our custom notification widget.
  void _showNotification(String message, {bool isError = false}) {
    // Cancel any existing timer to avoid the notification disappearing too early
    _notificationTimer?.cancel();

    setState(() {
      _notificationMessage = message;
      _isErrorNotification = isError;
    });

    // Set a timer to hide the notification after 3 seconds
    _notificationTimer = Timer(const Duration(seconds: 3), () {
      setState(() {
        _notificationMessage = null;
      });
    });
  }

  // Updated! Now correctly handles 'invalid-credential'.
  // Updated! Now handles both error types with one message.
  // Updated! This function now uses a switch statement for cleaner error handling.
  // Updated! Handles invalid email format and unifies credential errors.
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
      // Using a switch statement to handle specific error codes
      switch (e.code) {
      // New! Handles badly formatted emails.
        case 'invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;

      // Updated! Combined cases for better security.
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

  // All other functions (_signUp, dispose, etc.) are unchanged.
  void _submitForm() {
    if (_isLoginView) {
      _signIn();
    } else {
      _signUp();
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

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _notificationTimer?.cancel();
    super.dispose();
  }

  // The main build method is now wrapped in a Stack to show the notification
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          // New! This is our custom notification widget
          _buildNotificationWidget(),
        ],
      ),
    );
  }

  // New! A dedicated widget for the custom notification.
  Widget _buildNotificationWidget() {
    return Align(
      alignment: Alignment.bottomRight,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: _notificationMessage == null ? 0.0 : 1.0,
        child: Container(
          width: 200, // Matches the button width
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: _isErrorNotification ? Colors.redAccent : const Color(0xFF2D9A7A),
            borderRadius: BorderRadius.circular(30), // Pill shape
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 10,
                offset: Offset(0, 4),
              )
            ],
          ),
          child: Text(
            _notificationMessage ?? '',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
        ),
      ),
    );
  }

  // All other UI build methods are unchanged
  Widget _buildWideLayout() {
    return Row(
      children: [
        Expanded(
          flex: 2,
          child: Container(
            color: const Color(0xFF2D9A7A),
            child: _buildWelcomePanel(),
          ),
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
        return FadeTransition(opacity: animation, child: child);
      },
      child: _isLoginView ? _buildWelcomePanel(isNarrow: true) : _buildAuthFormNarrow(isNarrow: true),
    );
  }

  Widget _buildWelcomePanel({bool isNarrow = false}) {
    return Container(
      key: ValueKey('welcome_$_isLoginView'),
      color: const Color(0xFF2D9A7A),
      alignment: Alignment.center,
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.apple, color: Colors.white, size: 80),
            const SizedBox(height: 16),
            Text(
              _isLoginView ? 'New to Appie?' : 'Welcome Back!',
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 16),
            Text(
              _isLoginView
                  ? 'Sign up and discover a new way to connect.'
                  : 'To keep connected with us please login with your personal info.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, color: Colors.white70),
            ),
            const SizedBox(height: 32),
            OutlinedButton(
              onPressed: () => setState(() => _isLoginView = !_isLoginView),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white, width: 2),
                padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              child: Text(_isLoginView ? 'SIGN UP' : 'SIGN IN'),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildAuthFormNarrow({bool isNarrow = false}) {
    return Container(
      key: ValueKey('auth_form_$_isLoginView'),
      color: Colors.white,
      alignment: Alignment.center,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _isLoginView ? 'Sign In to Appie' : 'Create Account',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D9A7A)),
              ),
              const SizedBox(height: 16),
              _buildSocialLogins(),
              const SizedBox(height: 16),
              Text('or use your email for ${_isLoginView ? "login" : "registration"}', style: TextStyle(color: Colors.grey.shade600)),
              const SizedBox(height: 24),
              AnimatedSize(
                duration: const Duration(milliseconds: 300),
                child: _isLoginView ? const SizedBox.shrink() : _buildTextField(_nameController, 'Name', Icons.person_outline),
              ),
              if (!_isLoginView) const SizedBox(height: 16),
              _buildTextField(_emailController, 'Email', Icons.email_outlined, isFirstField: _isLoginView),
              const SizedBox(height: 16),
              _buildTextField(_passwordController, 'Password', Icons.lock_outline, isPassword: true),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitForm, // Updated!
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2D9A7A),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Text(
                    _isLoginView ? 'SIGN IN' : 'SIGN UP',
                    style: const TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              if (isNarrow)
                TextButton(
                  onPressed: () => setState(() => _isLoginView = !_isLoginView),
                  child: Text(
                    _isLoginView ? 'Need an account? Sign Up' : 'Have an account? Sign In',
                    style: const TextStyle(color: Color(0xFF2D9A7A)),
                  ),
                )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuthForm({bool isNarrow = false}) {
    return Container(
      key: ValueKey('auth_form_$_isLoginView'),
      color: Colors.white,
      alignment: Alignment.center,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _isLoginView ? 'Sign In to Appie' : 'Create Account',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2D9A7A)),
              ),
              const SizedBox(height: 16),
              _buildSocialLogins(),
              const SizedBox(height: 16),
              Text('or use your email for ${_isLoginView ? "login" : "registration"}', style: TextStyle(color: Colors.grey.shade600)),
              const SizedBox(height: 24),
              AnimatedSize(
                duration: const Duration(milliseconds: 300),
                child: _isLoginView ? const SizedBox.shrink() : _buildTextField(_nameController, 'Name', Icons.person_outline, isFirstField: true),
              ),
              if (!_isLoginView) const SizedBox(height: 16),
              _buildTextField(_emailController, 'Email', Icons.email_outlined, isFirstField: _isLoginView),
              const SizedBox(height: 16),
              _buildTextField(_passwordController, 'Password', Icons.lock_outline, isPassword: true),
              const SizedBox(height: 32),
              SizedBox(
                width: 200, // Fixed width for the button
                child: ElevatedButton(
                  onPressed: _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2D9A7A),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Text(
                    _isLoginView ? 'SIGN IN' : 'SIGN UP',
                    style: const TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSocialLogins() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildSocialButton(FontAwesomeIcons.google, () {}),
        const SizedBox(width: 20),
        _buildSocialButton(FontAwesomeIcons.facebookF, () {}),
        const SizedBox(width: 20),
        _buildSocialButton(FontAwesomeIcons.linkedinIn, () {}),
      ],
    );
  }

  Widget _buildSocialButton(IconData icon, VoidCallback onPressed) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
          shape: const CircleBorder(),
          padding: const EdgeInsets.all(16),
          side: BorderSide(color: Colors.grey.shade300)),
      child: FaIcon(icon, color: const Color(0xFF2D9A7A), size: 20),
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
        prefixIcon: Icon(icon, color: Colors.grey.shade500),
        filled: true,
        fillColor: Colors.grey.shade100,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}