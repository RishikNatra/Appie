import 'dart:ui'; // Added for ImageFilter
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  // Fetch user data from Firestore
  Future<Map<String, String>> _getUserData() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return {'name': 'Guest', 'email': 'Not logged in'};
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();
      if (doc.exists) {
        final data = doc.data();
        return {
          'name': data?['name']?.toString() ?? 'User',
          'email': data?['email']?.toString() ?? user.email ?? 'No email',
        };
      }
      return {
        'name': 'User',
        'email': user.email ?? 'No email',
      };
    } catch (e) {
      return {
        'name': 'User',
        'email': user.email ?? 'No email',
      };
    }
  }

  // Show profile pop-up
  void _showProfilePopup(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.2),
      barrierDismissible: true,
      builder: (BuildContext context) {
        return FutureBuilder<Map<String, String>>(
          future: _getUserData(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(color: Color(0xFF29ABE2)),
              );
            }
            final userData = snapshot.data ?? {'name': 'User', 'email': 'No email'};
            return _ProfilePopup(
              name: userData['name']!,
              email: userData['email']!,
              onClose: () => Navigator.of(context).pop(),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5FBFE), // --background
      appBar: AppBar(
        title: Text(
          'Appie Health',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF29ABE2), Color(0xFF1A87C2)], // --primary to darker blue
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.1),
        actions: [
          InkWell(
            onTap: () => _showProfilePopup(context),
            borderRadius: BorderRadius.circular(24),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFE6F7FA), // --health-blue-light
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person,
                color: Color(0xFF29ABE2), // --primary
                size: 24,
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome to Appie',
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF29ABE2), // --primary
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'What are your symptoms today?',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF718096), // --muted-foreground
                    ),
                  ),
                  const SizedBox(height: 16),
                  IllnessCard(
                    title: 'Fever',
                    icon: FontAwesomeIcons.thermometer,
                    color: 'blue',
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  IllnessCard(
                    title: 'Cold & Cough',
                    icon: FontAwesomeIcons.lungs,
                    color: 'green',
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  IllnessCard(
                    title: 'Headache',
                    icon: FontAwesomeIcons.headSideVirus,
                    color: 'orange',
                    onTap: () {},
                  ),
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: () {},
                    child: Card(
                      color: Colors.white, // --card
                      elevation: 2,
                      shadowColor: Colors.black.withOpacity(0.1),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Illness not listed here?',
                              style: GoogleFonts.poppins(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF29ABE2), // --primary
                              ),
                            ),
                            Container(
                              alignment: Alignment.center,
                              width: 24,
                              child: const Icon(
                                Icons.arrow_forward_ios,
                                color: Color(0xFF29ABE2), // --primary
                                size: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: constraints.maxWidth > 800 ? 220 : double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 2,
                        shadowColor: Colors.black.withOpacity(0.1),
                        backgroundColor: Colors.transparent,
                        surfaceTintColor: Colors.transparent,
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
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Center(
                          child: Text(
                            'EXPLORE MORE',
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
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class IllnessCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String color;
  final VoidCallback? onTap;

  const IllnessCard({
    super.key,
    required this.title,
    required this.icon,
    required this.color,
    this.onTap,
  });

  // Map color prop to gradient colors
  List<Color> _getGradientColors() {
    switch (color) {
      case 'blue':
        return [const Color(0xFF29ABE2), const Color(0xFF1A87C2)]; // --health-blue to --primary
      case 'green':
        return [const Color(0xFF16A085), const Color(0xFF0E8A6B)]; // --health-green to darker green
      case 'orange':
        return [const Color(0xFFF68C38), const Color(0xFFD6722E)]; // --health-orange to darker orange
      case 'red':
        return [const Color(0xFFF44336), const Color(0xFFD32F2F)]; // --health-red to darker red
      case 'purple':
        return [const Color(0xFF8E44AD), const Color(0xFF6A3281)]; // --health-purple to darker purple
      default:
        return [const Color(0xFF29ABE2), const Color(0xFF1A87C2)];
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        color: Colors.white, // --card
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _getGradientColors(),
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF2D3748), // --foreground
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfilePopup extends StatelessWidget {
  final String name;
  final String email;
  final VoidCallback onClose;

  const _ProfilePopup({
    required this.name,
    required this.email,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Stack(
        children: [
          // Blurred backdrop
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Container(color: Colors.black.withOpacity(0.2)),
            ),
          ),
          // Popup content
          Container(
            margin: const EdgeInsets.only(top: 80),
            constraints: const BoxConstraints(maxWidth: 384),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 25,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF29ABE2), Color(0xFF16A085)], // --primary to --health-green
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.person,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              name,
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              email,
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: onClose,
                        icon: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ),
                // Body
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: GestureDetector(
                    onTap: () async {
                      await FirebaseAuth.instance.signOut();
                      onClose();
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.transparent,
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.logout,
                            color: Color(0xFF718096), // --muted-foreground
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Logout',
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF2D3748), // --foreground
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}