import 'dart:ui';
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
      barrierColor: Colors.transparent, // Remove global barrier color
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
          final maxWidth = constraints.maxWidth > 1200 ? 1200.0 : constraints.maxWidth;
          final padding = constraints.maxWidth > 800 ? 32.0 : constraints.maxWidth > 600 ? 24.0 : 16.0;
          final columns = constraints.maxWidth > 1024 ? 3 : constraints.maxWidth > 768 ? 2 : 1;

          return SingleChildScrollView(
            child: Center(
              child: Container(
                constraints: BoxConstraints(maxWidth: maxWidth),
                padding: EdgeInsets.symmetric(horizontal: padding, vertical: 32),
                child: Column(
                  children: [
                    // Welcome Section
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 500),
                      opacity: 1.0,
                      child: Column(
                        children: [
                          ShaderMask(
                            shaderCallback: (bounds) => const LinearGradient(
                              colors: [Color(0xFF29ABE2), Color(0xFF16A085)], // --primary to --health-green
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ).createShader(bounds),
                            child: Text(
                              'Welcome to Appie Health',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                fontSize: constraints.maxWidth > 600 ? 48 : 36,
                                fontWeight: FontWeight.w700,
                                color: Colors.white, // White for shader effect
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Tell us about your symptoms and get personalized health guidance tailored just for you',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF718096), // --muted-foreground
                            ),
                            maxLines: 2,
                          ),
                          const SizedBox(height: 48),
                        ],
                      ),
                    ),
                    // Common Symptoms
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Common Symptoms',
                          style: GoogleFonts.poppins(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF2D3748), // --foreground
                          ),
                        ),
                        const SizedBox(height: 24),
                        GridView.count(
                          crossAxisCount: columns,
                          crossAxisSpacing: 24,
                          mainAxisSpacing: 24,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          children: [
                            IllnessCard(
                              title: 'Fever',
                              description: 'High temperature, chills, and body aches',
                              icon: FontAwesomeIcons.thermometer,
                              color: 'red',
                              onTap: () {},
                            ),
                            IllnessCard(
                              title: 'Cold & Cough',
                              description: 'Runny nose, sneezing, and throat irritation',
                              icon: FontAwesomeIcons.lungs,
                              color: 'blue',
                              onTap: () {},
                            ),
                            IllnessCard(
                              title: 'Headache',
                              description: 'Head pain, tension, and sensitivity',
                              icon: FontAwesomeIcons.brain,
                              color: 'purple',
                              onTap: () {},
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    // Other Conditions
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Other Conditions',
                          style: GoogleFonts.poppins(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF2D3748), // --foreground
                          ),
                        ),
                        const SizedBox(height: 24),
                        GridView.count(
                          crossAxisCount: constraints.maxWidth > 768 ? 4 : 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          children: [
                            'Diabetes',
                            'Hypertension',
                            'Asthma',
                            'Allergies',
                          ].map((condition) {
                            return GestureDetector(
                              onTap: () {},
                              child: Card(
                                color: Colors.white, // --card
                                elevation: 2,
                                shadowColor: Colors.black.withOpacity(0.1),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  side: const BorderSide(color: Color(0xFFDEE2E6)), // --border
                                ),
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  child: Center(
                                    child: Text(
                                      condition,
                                      style: GoogleFonts.poppins(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: const Color(0xFF2D3748), // --foreground
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    // Illness Not Listed
                    IllnessCard(
                      title: 'My illness is not listed',
                      description: 'Describe your symptoms in detail for personalized assistance',
                      icon: Icons.add,
                      color: 'green',
                      onTap: () {},
                    ),
                    const SizedBox(height: 32),
                    // Explore More Button
                    SizedBox(
                      width: constraints.maxWidth > 800 ? 320 : double.infinity,
                      child: InkWell(
                        onTap: () {},
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF29ABE2), Color(0xFF1A87C2)], // --primary to darker blue
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.15),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16), // Reduced horizontal padding
                          child: Row(
                            mainAxisSize: MainAxisSize.min, // Fit content
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Flexible(
                                child: Text(
                                  'Explore More Health Topics',
                                  style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(
                                Icons.arrow_forward,
                                color: Colors.white,
                                size: 20,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
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
  final String? description;
  final IconData icon;
  final String color;
  final VoidCallback? onTap;

  const IllnessCard({
    super.key,
    required this.title,
    this.description,
    required this.icon,
    required this.color,
    this.onTap,
  });

  List<Color> _getGradientColors() {
    switch (color) {
      case 'blue':
        return [const Color(0xFF29ABE2), const Color(0xFF1A87C2)]; // --health-blue to darker blue
      case 'green':
        return [const Color(0xFF16A085), const Color(0xFF0E8A6B)]; // --health-green to darker green
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
          side: const BorderSide(color: Color(0xFFDEE2E6)), // --border
        ),
        child: Container(
          padding: const EdgeInsets.all(24),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
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
                    if (description != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        description!,
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF718096), // --muted-foreground
                        ),
                      ),
                    ],
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
      insetPadding: const EdgeInsets.all(16), // Ensure proper padding
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          // Blurred backdrop
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Container(
                color: Colors.black.withOpacity(0.2),
              ),
            ),
          ),
          // Popup content
          Container(
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