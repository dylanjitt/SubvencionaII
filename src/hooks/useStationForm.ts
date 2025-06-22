import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useStationAdmin } from "./useStationAdmi";
import { useAuthStore } from "../store/authStore";
import { v4 as uuidv4 } from "uuid";
import type { GasStation } from "../interface/GasStation";

const ZONES = ["Centro", "Max Paredes", "San Antonio", "Periférica", "Mallasa"];
const FUEL_TYPES = ["Especial", "Diesel", "GNV"];

const stationSchema = Yup.object({
  name: Yup.string()
    .required("Nombre de la estación es requerida")
    .min(5, "Mínimo 5 caracteres")
    .max(50, "Máximo 50 caracteres")
    .trim("No se permiten solo espacios")
    .matches(/^[a-zA-Z0-9\s]+$/, "No se permiten solo caracteres especiales")
    .matches(/^(?!.*\d+$).+$/, "No se permiten solo números"),
  zone: Yup.string().required("Zona es requerida"),
  address: Yup.string()
    .required("Dirección es requerida")
    .min(15, "Mínimo 15 caracteres")
    .max(60, "Máximo 60 caracteres")
    .trim("No se permiten solo espacios")
    .matches(/^[a-zA-Z0-9\s]+$/, "No se permiten solo caracteres especiales")
    .matches(/^(?!.*\d+$).+$/, "No se permiten solo números"),
  phone: Yup.string()
    .required("Teléfono es requerido")
    .matches(/^\d{8}$/, "Debe contener exactamente 8 dígitos numéricos"),
  selectedDays: Yup.array()
    .when("scheduleType", {
      is: "Atención personalizada",
      then: (schema) => schema.min(3, "Selecciona al menos tres días"),
      otherwise: (schema) => schema,
    }),
  openTime: Yup.string()
    .required("Hora de apertura es requerida")
    .matches(
      /^(0[5-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "La hora no puede estar entre 00:01 y 04:59"
    ),
  closeTime: Yup.string()
    .required("Hora de cierre es requerida")
    .matches(
      /^(0[5-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "La hora no puede estar entre 00:01 y 04:59"
    )
    .test(
      "is-after-open",
      "La hora de cierre debe ser posterior a la de apertura",
      function (value) {
        const { openTime } = this.parent;
        if (!openTime || !value) return true;
        return value > openTime;
      }
    ),
  openingHours: Yup.array().of(
    Yup.object().shape({
      day: Yup.string(),
      open: Yup.string().matches(
        /^(0[5-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
        "La hora no puede estar entre 00:01 y 04:59"
      ),
      close: Yup.string()
        .matches(
          /^(0[5-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          "La hora no puede estar entre 00:01 y 04:59"
        )
        .test(
          "is-after-open",
          "La hora de cierre debe ser posterior a la de apertura",
          function (value) {
            const { open } = this.parent;
            if (!open || !value) return true;
            return value > open;
          }
        ),
    })
  ),
  services: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        capacity: Yup.number()
          .required()
          .min(10000, "La capacidad mínima es 10000")
          .max(600000, "La capacidad máxima es 600000")
          .test(
            "no-negative",
            "La capacidad no puede ser negativa",
            (value) => value >= 0
          ),
        stock: Yup.number().min(0, "Stock no puede ser negativo"),
        selected: Yup.boolean(),
      })
    )
    .min(1, "Al menos selecciona un servicio"),
});

interface UseStationFormProps {
  station?: GasStation;
  isEditMode: boolean;
  onClose: () => void;
}

export const useStationForm = ({ station, isEditMode, onClose }: UseStationFormProps) => {
  const { createStation, updateStation } = useStationAdmin();
  const { user } = useAuthStore();
  const [scheduleType, setScheduleType] = useState("Todos los dias");
  const [uniformHours] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: station?.name || "",
      zone: station?.zone || "",
      address: station?.address || "",
      phone: station?.phone || "",
      selectedDays: station ? station.openingHours.map((h) => h.day) : [],
      openTime: station?.openingHours[0]?.open || "08:00",
      closeTime: station?.openingHours[0]?.close || "20:00",
      scheduleType,
      openingHours: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].map((day) => ({
        day,
        open: station?.openingHours.find((h) => h.day === day)?.open || "08:00",
        close: station?.openingHours.find((h) => h.day === day)?.close || "20:00",
      })),
      services: FUEL_TYPES.map((type) => ({
        name: type,
        capacity: station?.services.find((s) => s.name === type)?.capacity || 10000,
        stock: station?.services.find((s) => s.name === type)?.stock || 0,
        selected: !!station?.services.find((s) => s.name === type),
      })),
    },
    validationSchema: stationSchema,
    onSubmit: async (values) => {
      let daysToSubmit;
      if (scheduleType === "Todos los dias") {
        daysToSubmit = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
      } else if (scheduleType === "Lunes a Viernes") {
        daysToSubmit = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
      } else {
        daysToSubmit = values.selectedDays;
      }

      const stationData = {
        id: isEditMode ? station?.id : uuidv4(),
        userId: user?.id || "",
        name: values.name,
        zone: values.zone,
        address: values.address,
        phone: values.phone,
        openingHours: daysToSubmit.map((day) => ({
          day,
          open: uniformHours ? values.openTime : values.openingHours.find((h) => h.day === day)?.open || "08:00",
          close: uniformHours ? values.closeTime : values.openingHours.find((h) => h.day === day)?.close || "20:00",
        })),
        services: values.services
          .filter((s) => s.selected)
          .map((s) => ({ name: s.name, capacity: s.capacity, stock: s.stock })),
      };

      if (isEditMode) {
        await updateStation(stationData.id, stationData);
      } else {
        await createStation(stationData);
      }
      onClose();
      formik.resetForm();
    },
  });

  const handleDayChange = (day: string) => {
    const selectedDays = formik.values.selectedDays.includes(day)
      ? formik.values.selectedDays.filter((d) => d !== day)
      : [...formik.values.selectedDays, day];
    formik.setFieldValue("selectedDays", selectedDays);
  };

  const handleServiceChange = (event: React.MouseEvent<HTMLElement>, newServices: string[]) => {
    formik.setFieldValue(
      "services",
      formik.values.services.map((s) => ({
        ...s,
        selected: newServices.includes(s.name),
      }))
    );
  };

  const handleCapacityChange = (name: string, capacity: number) => {
    const clampedCapacity = Math.max(10000, Math.min(600000, capacity));
    formik.setFieldValue(
      "services",
      formik.values.services.map((s) =>
        s.name === name ? { ...s, capacity: clampedCapacity } : s
      )
    );
  };

  const handleTimeChange = (day: string, field: string, value: string) => {
    const [hours] = value.split(":").map(Number);
    const clampedValue = hours < 5 ? "05:00" : hours > 23 ? "23:59" : value;
    formik.setFieldValue(
      "openingHours",
      formik.values.openingHours.map((h) =>
        h.day === day ? { ...h, [field]: clampedValue } : h
      )
    );
  };

  const handleOpenTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const [hours] = value.split(":").map(Number);
    if (hours < 5) value = "05:00";
    else if (hours > 23) value = "23:59";
    formik.setFieldValue("openTime", value);
  };

  const handleCloseTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const [hours] = value.split(":").map(Number);
    if (hours < 5) value = "05:00";
    else if (hours > 23) value = "23:59";
    if (value <= formik.values.openTime) {
      const [openHours, openMinutes] = formik.values.openTime.split(":").map(Number);
      value = `${openHours + 1}:${openMinutes.toString().padStart(2, "0")}`;
    }
    formik.setFieldValue("closeTime", value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.slice(0, 50);
    if (/^\s+$/.test(value) || /^[^a-zA-Z0-9\s]+$/.test(value) || /^\d+$/.test(value)) {
      value = formik.values.name;
    }
    formik.setFieldValue("name", value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.slice(0, 60);
    if (/^\s+$/.test(value) || /^[^a-zA-Z0-9\s]+$/.test(value) || /^\d+$/.test(value)) {
      value = formik.values.address;
    }
    formik.setFieldValue("address", value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    formik.setFieldValue("phone", value);
  };

  return {
    formik,
    scheduleType,
    setScheduleType,
    handleDayChange,
    handleServiceChange,
    handleCapacityChange,
    handleTimeChange,
    handleOpenTimeChange,
    handleCloseTimeChange,
    handleNameChange,
    handleAddressChange,
    handlePhoneChange,
    ZONES,
    FUEL_TYPES,
  };
};