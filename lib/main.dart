import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'firebase_options.dart';
import 'screens/home_page.dart';
import 'screens/login_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Appie Health',
      theme: ThemeData(
        primaryColor: const Color(0xFF29ABE2), // --primary
        scaffoldBackgroundColor: const Color(0xFFF5FBFE), // --background
        textTheme: GoogleFonts.poppinsTextTheme(),
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF29ABE2),
          primary: const Color(0xFF29ABE2),
          secondary: const Color(0xFFE6F7FA), // --health-blue-light
          background: const Color(0xFFF5FBFE),
          surface: Colors.white,
          onPrimary: Colors.white,
          onSecondary: const Color(0xFF2D3748), // --foreground
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
        cardTheme: CardThemeData( // Changed from CardTheme to CardThemeData
          color: Colors.white,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return const HomePage();
          }
          return const LoginScreen();
        },
      ),
    );
  }
}