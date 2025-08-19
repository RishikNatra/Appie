import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_fonts/google_fonts.dart'; // Added for modern typography

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
      } else {
        return {
          'name': 'User',
          'email': user.email ?? 'No email',
        };
      }
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
      builder: (BuildContext context) {
        return FutureBuilder<Map<String, String>>(
          future: _getUserData(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return AlertDialog(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                backgroundColor: Colors.white,
                content: const SizedBox(
                  height: 100,
                  child: Center(child: CircularProgressIndicator(color: Color(0xFF2D9A7A))),
                ),
              );
            }
            final userData = snapshot.data ?? {'name': 'User', 'email': 'No email'};
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              backgroundColor: Colors.white,
              contentPadding: const EdgeInsets.all(20),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    userData['name']!,
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF2D9A7A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    userData['email']!,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.signOut();
                        Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 2,
                      ),
                      child: Text(
                        'LOG OUT',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50, // Softer background
      appBar: AppBar(
        title: Text(
          'Appie',
          style: GoogleFonts.poppins(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF2D9A7A), Color(0xFF45B7AA)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person, color: Colors.white, size: 24),
            tooltip: 'Profile',
            onPressed: () => _showProfilePopup(context),
          ),
          const SizedBox(width: 8),
        ],
        elevation: 4,
        shadowColor: Colors.black26,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Hero(
                    tag: 'appie_title',
                    child: Material(
                      color: Colors.transparent,
                      child: TweenAnimationBuilder(
                        tween: Tween<Offset>(
                          begin: const Offset(-200.0, 0.0),
                          end: const Offset(0.0, 0.0),
                        ),
                        duration: const Duration(milliseconds: 800),
                        curve: Curves.easeOut,
                        builder: (BuildContext context, Offset offset, Widget? child) {
                          return Transform.translate(
                            offset: offset,
                            child: FadeTransition(
                              opacity: AlwaysStoppedAnimation(offset.dx < -100 ? 0.0 : 1.0),
                              child: Text(
                                'Welcome to Appie',
                                style: GoogleFonts.poppins(
                                  fontSize: 30,
                                  fontWeight: FontWeight.w700,
                                  color: const Color(0xFF2D9A7A),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "What are your symptoms today?",
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 24),
                  AnimatedOpacity(
                    opacity: 1.0,
                    duration: const Duration(milliseconds: 600),
                    child: Column(
                      children: [
                        IllnessCard(title: 'Fever'),
                        const SizedBox(height: 12),
                        IllnessCard(title: 'Cold & Cough'),
                        const SizedBox(height: 12),
                        IllnessCard(title: 'Headache'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  GestureDetector(
                    onTap: () {
                      // Navigate to IllnessDetailsPage
                    },
                    child: Card(
                      color: Colors.white,
                      elevation: 3,
                      shadowColor: Colors.black12,
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
                                color: const Color(0xFF2D9A7A),
                              ),
                            ),
                            Container(
                              alignment: Alignment.center,
                              width: 24,
                              child: const Icon(
                                Icons.arrow_forward_ios,
                                color: Color(0xFF2D9A7A),
                                size: 14, // Small and centered
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: constraints.maxWidth > 800 ? 220 : double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Add navigation or action
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 3,
                        shadowColor: Colors.black26,
                        foregroundColor: Colors.white,
                        backgroundColor: Colors.transparent,
                        surfaceTintColor: Colors.transparent,
                        overlayColor: Colors.white.withOpacity(0.1), // Subtle press effect
                      ).copyWith(
                        backgroundColor: MaterialStateProperty.resolveWith(
                              (states) => states.contains(MaterialState.pressed)
                              ? const Color(0xFF45B7AA)
                              : const Color(0xFF2D9A7A),
                        ),
                      ),
                      child: Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF2D9A7A), Color(0xFF45B7AA)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.all(Radius.circular(30)),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        child: Center(
                          child: Text(
                            'EXPLORE MORE',
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
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

  const IllnessCard({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {}, // Required for scale animation
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.identity()..scale(1.0), // Scale effect on tap
        child: Card(
          color: Colors.white,
          elevation: 3,
          shadowColor: Colors.black12,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            title: Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2D9A7A),
              ),
            ),
            trailing: Container(
              alignment: Alignment.center,
              width: 24,
              child: const Icon(
                Icons.arrow_forward_ios,
                color: Color(0xFF2D9A7A),
                size: 14, // Small and centered
              ),
            ),
            onTap: () {
              // Navigate to IllnessDetailsPage
            },
          ),
        ),
      ),
    );
  }
}