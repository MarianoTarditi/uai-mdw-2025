"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import PersonalDataForm from "./PersonalDataForm";
import EmergencyDataForm from "./EmergencyDataForm";
import ClinicalDataForm from "./ClinicalDataForm";
import ActivityDataForm from "./ActivityDataForm";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10">

      <Card>
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalDataForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Emergencia</CardTitle>
        </CardHeader>
        <CardContent>
          <EmergencyDataForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos Clínicos</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicalDataForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Actividad Física</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityDataForm />
        </CardContent>
      </Card>

    </div>
  );
}
