import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

final themeData = ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF3B82F6), // primary (blue-500 equivalent)
    brightness: Brightness.light,
    primary: const Color(0xFF3B82F6), // Tailwind primary (blue-500)
    onPrimary: Colors.white,
    secondary: const Color(0xFF6B7280), // Tailwind gray-500
    onSecondary: Colors.white,
    surface: Colors.white, // card background
    onSurface: const Color(0xFF1F2937), // foreground (gray-800)
    onSurfaceVariant: const Color(0xFF6B7280), // muted-foreground (gray-500)
    outline: const Color(0xFFE5E7EB), // border (gray-200)
  ),
  textTheme: GoogleFonts.interTextTheme(
    ThemeData.light().textTheme,
  ),
  cardTheme: CardThemeData(
    color: Colors.white,
    elevation: 4,
    margin: EdgeInsets.zero,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12), // Tailwind borderRadius.lg
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF3B82F6), // primary
      foregroundColor: Colors.white,
      textStyle: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w500,
      ),
      padding: const EdgeInsets.symmetric(vertical: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8), // Tailwind borderRadius.md
      ),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: const Color(0xFF3B82F6), // primary
      textStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Color(0xFFE5E7EB)), // border
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2),
    ),
    hintStyle: GoogleFonts.inter(
      color: const Color(0xFF6B7280), // muted-foreground
    ),
  ),
  scaffoldBackgroundColor: const Color(0xFFF9FAFB), // Tailwind gray-50
);