import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import classes from "../AuthForm.module.css";

export function SignUp() {
  return (
    <section className={`${classes.container} auth-premium-main`}>
      <Card className={`${classes.card} auth-premium-card border-0 py-0 premium-shell`}>
        <CardHeader className={classes.cardHeader}>
          <p className={classes.eyebrow}>Alta administrada</p>
          <CardTitle className={classes.title}>Registro deshabilitado</CardTitle>
          <p className={classes.subtitle}>
            El acceso al gimnasio lo crea un administrador cuando te incorpora.
          </p>
        </CardHeader>

        <CardContent className={classes.cardContent}>
          <div className={classes.form}>
            <p className={classes.subtitle}>
              Pedile al administrador que cree tu usuario con tu email y te asigne un PIN.
              Después ingresás desde la pantalla de login.
            </p>

            <div className={classes.hintRow}>
              <Link to="/login" className={classes.switch}>
                Volver al login
              </Link>
            </div>

            <Button asChild className={`${classes.submit} w-full`}>
              <Link to="/login">Ir al login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
