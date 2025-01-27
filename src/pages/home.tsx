import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import clevLogo from '../hooks/clevLogo.png';
import sciLogo from '../hooks/sciLogo.png';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f4f1e1',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
        paddingTop: 2, 
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Crimson Text", serif',
            fontWeight: 'bold',
            marginBottom: 2,
            textAlign: 'center',
          }}
        >
          Welcome to the Museum Exhibition
        </Typography>

        {/* Styled Paragraph */}
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            fontFamily: '"Roboto", sans-serif',
            color: '#5a5a5a',
            textAlign: 'center',
            marginBottom: 4,
            lineHeight: 1.6,
          }}
        >
          Please enjoy searching two great museum collections and feel free to
          favourite any that you really enjoy to make sure you never lose them.
        </Typography>

        {/* Museum Photos Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <img
            src={clevLogo}
            alt="Cleveland Museum Logo"
            style={{ width: '45%', borderRadius: '8px' }}
          />
          <img
            src={sciLogo}
            alt="Science Museum Logo"
            style={{ width: '45%', borderRadius: '8px' }}
          />
        </Box>

        {/* Museum Descriptions */}
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              fontFamily: '"Roboto", sans-serif',
              color: '#5a5a5a',
              textAlign: 'center',
              maxWidth: '45%',
              lineHeight: 1.6,
            }}
          >
            <strong>Cleveland Museum:</strong> Located in Cleveland, Ohio, this
            museum is known for its extensive collection of fine art and
            antiquities, offering an inspiring blend of historical and
            contemporary works that captivate visitors worldwide.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              fontFamily: '"Roboto", sans-serif',
              color: '#5a5a5a',
              textAlign: 'center',
              maxWidth: '45%',
              lineHeight: 1.6,
            }}
          >
            <strong>Science Museum:</strong> Situated in London, this museum
            highlights scientific achievements and innovation, featuring
            interactive exhibits and a wealth of historical artifacts to inspire
            curiosity and learning.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

