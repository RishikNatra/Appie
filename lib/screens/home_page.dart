// Import Flutter's Material Design library
import 'package:flutter/material.dart';

// Import the existing LoginScreen to enable navigation
import 'login_screen.dart';

// Create a StatelessWidget for the HomePage
// A StatelessWidget is used because the page itself doesn't need to manage state,
// but it contains child widgets that might (like the animation below).
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  // Function to navigate to the LoginScreen
  void _navigateToLogin(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Appie'),
        backgroundColor: Theme.of(context).primaryColor,
        actions: [
          // A button in the app bar to navigate to the sign-in page
          TextButton(
            onPressed: () => _navigateToLogin(context),
            child: const Text(
              'Sign In',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Animated sliding window for the welcome message
              // This uses an AnimatedOpacity and a transform to create a smooth entrance effect.
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
              // List of cards for common illnesses
              const IllnessCard(title: 'Fever'),
              const IllnessCard(title: 'Cold & Cough'),
              const IllnessCard(title: 'Headache'),
              const SizedBox(height: 20),
              // Card for "illness not listed"
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

// A custom widget for the illness cards to reuse the same style
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
