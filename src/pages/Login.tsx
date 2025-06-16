import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import Toast from "../components/Toast";
import { useLogin } from "../hooks/useLogin";

function LoginPage() {

  const {formik,showPassword,isLoading,loginError,errorMessage,handleToastClose,handleClickShowPassword,handleMouseDownPassword,handleMouseUpPassword,navigate}=useLogin()

  return (
    <Container maxWidth="xs">
      <Toast
        open={loginError}
        message={errorMessage}
        severity="error"
        onClose={handleToastClose}
      />
      <Box sx={{ marginY: 8 }}>
        <CardContent
          sx={{
            marginTop: 25,
            padding: 4,
            textAlign: "center",
            boxShadow: 3,
            paddingBottom: 12,
            borderRadius: 5
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image="src/assets/gasolinaYaLogo.png"
            sx={{ objectFit: 'contain' }}
            alt="Gasolina Ya Logo"
          />
          
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="input-email-textfield"
              label="Email"
              variant="filled"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              sx={{ marginBottom: 3, borderRadius: 10 }}
              disabled={isLoading}
            />

            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: 1, borderRadius: 10 }}
              error={formik.touched.password && Boolean(formik.errors.password)}
            >
              <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
              <FilledInput
                id="filled-adornment-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.password && formik.errors.password && (
                <Typography variant="caption" color="error">
                  {formik.errors.password}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              disabled={isLoading || !(formik.dirty && formik.isValid)}
              sx={{
                marginTop: 2,
                width: "75%",
                height: '3rem',
                fontSize: '1rem',
                borderRadius: 20,
                backgroundColor: '#1E8BC3',
                fontWeight: '500' // Fixed typo: removed 'quiero'
              }}
              variant="contained"
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <Button
            onClick={() => navigate('/register')}
            disabled={isLoading}
            sx={{
              marginTop: 2,
              width: "75%",
              height: '3rem',
              fontSize: '1rem',
              borderRadius: 20,
              color: '#1E8BC3',
              borderColor: '#1E8BC3',
              borderWidth: 2
            }}
            variant="outlined"
          >
            Crear Cuenta
          </Button>
        </CardContent>
      </Box>
    </Container>
  );
}

export default LoginPage;