import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  // Function to fetch user data from Firestore
  Future<Map<String, String>> _getUserData() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();
      final data = doc.data();
      return {
        'name': data?['name'] ?? 'User',
        'email': data?['email'] ?? user.email ?? 'No email',
      };
    }
    return {'name': 'User', 'email': 'No email'};
  }

  // Function to show the profile pop-up
  void _showProfilePopup(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return FutureBuilder<Map<String, String>>(
          future: _getUserData(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const AlertDialog(
                content: SizedBox(
                  height: 100,
                  child: Center(child: CircularProgressIndicator()),
                ),
              );
            }
            final userData = snapshot.data ?? {'name': 'User', 'email': 'No email'};
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              backgroundColor: Colors.white,
              contentPadding: const EdgeInsets.all(16),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    userData['name']!,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2D9A7A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    userData['email']!,
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.signOut();
                        Navigator.of(context).pop(); // Close the dialog
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text(
                        'LOG OUT',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
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
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Appie',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFF2D9A7A),
        actions: [
          IconButton(
            icon: const Icon(Icons.person, color: Colors.white, size: 24),
            tooltip: 'Profile',
            onPressed: () => _showProfilePopup(context),
          ),
          const SizedBox(width: 8), // Add some padding
        ],
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
                  TweenAnimationBuilder(
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
                          child: const Text(
                            'Welcome to Appie',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2D9A7A),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "What are your symptoms today?",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 24),
                  AnimatedOpacity(
                    opacity: 1.0,
                    duration: const Duration(milliseconds: 500),
                    child: Column(
                      children: [
                        IllnessCard(title: 'Fever'),
                        const SizedBox(height: 16),
                        IllnessCard(title: 'Cold & Cough'),
                        const SizedBox(height: 16),
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
                      color: Colors.grey.shade100,
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Illness not listed here?',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2D9A7A),
                              ),
                            ),
                            Icon(
                              Icons.arrow_forward_ios,
                              color: const Color(0xFF2D9A7A),
                              size: 14, // Smaller size
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: constraints.maxWidth > 800 ? 200 : double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Add navigation or action
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2D9A7A),
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 4,
                      ),
                      child: const Text(
                        'EXPLORE MORE',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
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
    return Card(
      color: Colors.grey.shade100,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF2D9A7A),
          ),
        ),
        trailing: Container(
          alignment: Alignment.center, // Center the icon
          width: 24, // Fixed width to ensure centering
          child: const Icon(
            Icons.arrow_forward_ios,
            color: Color(0xFF2D9A7A),
            size: 14, // Smaller size
          ),
        ),
        onTap: () {
          // Navigate to IllnessDetailsPage
        },
      ),
    );
  }
}