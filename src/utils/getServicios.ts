import { useDb } from "../hooks/useDb";
type ServiceItem = {
  label: string;
  value: string;
};
export const getServicios = () => {
  const { services } = useDb({ dbRoute: "services" });
  const servicesArray: ServiceItem[] = [];
  services.map((service) =>
    servicesArray.push({
      label: service.nombre_servicio,
      value: service.nombre_servicio.toLowerCase(),
    })
  );
  return {
    servicesArray,
  };
};
