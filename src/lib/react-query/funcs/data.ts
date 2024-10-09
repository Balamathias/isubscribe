import { VTPassServiceName } from "@/lib/vtpass";
import { getServiceVariations } from "@/lib/vtpass/services";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";

export const useServiceVariations = (serviceID: VTPassServiceName) => useQuery({
  queryKey: [QueryKeys.get_service_variations, serviceID],
  queryFn: () =>  getServiceVariations(serviceID)
})

export const useServices = () => {

  const { data: mtnService, isPending: loadingmtnService } = useServiceVariations('mtn-data')
  const { data: gloService, isPending: loadinggloService } = useServiceVariations('glo-data')
  const { data: airtelService, isPending: loadingairtelService } = useServiceVariations('airtel-data')
  const { data: etisalatService, isPending: loadingetisalatService } = useServiceVariations('9mobile-data')
  
  return {
     'mtn': mtnService?.content.varations,
     'glo': gloService?.content?.varations,
     '9mobile': etisalatService?.content?.varations,
     'airtel': airtelService?.content?.varations,

     isLoading: loadingairtelService || loadingetisalatService || loadinggloService || loadingmtnService
  }
}