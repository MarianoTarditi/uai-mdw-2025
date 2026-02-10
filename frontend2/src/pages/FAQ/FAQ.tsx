import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // Asumiendo que tienes el botón
import { Mail } from "lucide-react";

// Datos de las preguntas (puedes mover esto a un archivo separado o recibirlo por props)
const faqData = [
  {
    id: "item-1",
    question: "¿Es accesible el componente?",
    answer:
      "Sí. Se adhiere al patrón WAI-ARIA Design, lo que garantiza que sea completamente accesible para lectores de pantalla y navegación por teclado.",
  },
  {
    id: "item-2",
    question: "¿Puedo cambiar los estilos?",
    answer:
      "Absolutamente. Está construido con Tailwind CSS, por lo que puedes modificar colores, espaciados y tipografía directamente en las clases o en tu archivo de configuración global.",
  },
  {
    id: "item-3",
    question: "¿Tiene soporte para modo oscuro?",
    answer:
      "Sí, al igual que todos los componentes de shadcn/ui, respeta automáticamente la preferencia de tema de tu aplicación (dark/light mode).",
  },
  {
    id: "item-4",
    question: "¿Cómo gestiono las animaciones?",
    answer:
      "Las animaciones están gestionadas por radix-ui y tailwind-animate. Vienen configuradas por defecto para ser suaves y performantes.",
  },
];

export function FAQ() {
  return (
    <section className="w-full pt-8 pb-8 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de la sección */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            Soporte
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Preguntas Frecuentes
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Todo lo que necesitas saber sobre el producto y la facturación. ¿No
            encuentras la respuesta? Contáctanos.
          </p>
        </div>

        {/* Acordeón de preguntas */}
        <div className="mx-auto max-w-3xl space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-7">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Pie de sección / Contacto */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto flex flex-col items-center gap-4 border">
            <h3 className="text-xl font-semibold">¿Aún tienes preguntas?</h3>
            <p className="text-muted-foreground">
              No te preocupes, nuestro equipo está aquí para ayudarte.
            </p>
            <Button className="mt-2">
              <Mail className="mr-2 h-4 w-4" />
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
