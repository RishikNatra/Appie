// Import Flutter's Material Design library
import 'package:flutter/material.dart';
// New! Import Firebase Auth to handle signing out
import 'package:firebase_auth/firebase_auth.dart';

// Create a StatelessWidget for the HomePage
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Appie'),
        backgroundColor: Theme.of(context).primaryColor,
        // Updated! The actions list now has a Log Out button.
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: 'Log Out',
            onPressed: () async {
              // Sign the user out of Firebase
              await FirebaseAuth.instance.signOut();
              // The StreamBuilder in main.dart will automatically handle navigation
              // back to the LoginScreen.
            },
          ),
        ],
      ),
      // The rest of your page body is completely unchanged.
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
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
                        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
              const Text(
                "What are your symptoms today?",
                style: TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 20),
              const IllnessCard(title: 'Fever'),
              const IllnessCard(title: 'Cold & Cough'),
              const IllnessCard(title: 'Headache'),
              const SizedBox(height: 20),
              Card(
                color: Colors.grey[200],
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: const ListTile(
                  title: Text(
                    'Illness not listed here?',
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
                  ),
                  trailing: Icon(Icons.arrow_forward_ios, color: Colors.blue),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// The custom IllnessCard widget is unchanged.
class IllnessCard extends StatelessWidget {
  final String title;

  const IllnessCard({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: ListTile(
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios),
      ),
    );
  }
}