import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";
import { Box, Button, TextField, Typography, Container, CssBaseline } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error: any) {
      alert("Error logging in: " + error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
    } catch (error: any) {
      alert("Error signing up: " + error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
          marginTop: 8,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Login to Your Account
        </Typography>

        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Log In Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
        >
          Log In
        </Button>

        {/* Sign Up Button */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        {/* Info Text */}
        <Typography
          variant="body2"
          sx={{ marginTop: 2, textAlign: "center", color: "textSecondary" }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;

