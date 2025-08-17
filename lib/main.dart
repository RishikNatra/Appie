// Import Flutter's Material Design library
import 'package:flutter/material.dart';

// Import Firebase core and authentication
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'firebase_options.dart';

// Import the home and login screens
import 'screens/home_page.dart';
import 'screens/login_screen.dart';

// Main function to run the app
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

// Main application widget
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Healthcare App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      // Use a StreamBuilder to dynamically show the correct page
      home: StreamBuilder<User?>(
        // The stream listens for changes in the user's authentication state
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          // If the snapshot has data, a user is logged in
          if (snapshot.hasData) {
            return const HomePage();
          }
          // Otherwise, show the login page
          return const LoginScreen();
        },
      ),
    );
  }
}