import { VTPassServiceName } from "@/lib/vtpass";
import { getServiceVariations } from "@/lib/vtpass/services";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import { mapRawDataToPlans } from "@/utils/format-data";


export const useServiceVariations = (serviceID: VTPassServiceName) => useQuery({
  queryKey: [QueryKeys.get_service_variations, serviceID],
  queryFn: () =>  getServiceVariations(serviceID)
})

export const useServices = () => {

  const { data: mtnService, isPending: loadingmtnService } = useServiceVariations('mtn-data')
  const { data: gloService, isPending: loadinggloService } = useServiceVariations('glo-data')
  const { data: airtelService, isPending: loadingairtelService } = useServiceVariations('airtel-data')
  const { data: etisalatService, isPending: loadingetisalatService } = useServiceVariations('etisalat-data')

  const mtnMapped = mapRawDataToPlans(mtnService?.content?.varations || [], 'mtn');
  const gloMapped = mapRawDataToPlans(gloService?.content?.varations || [], 'glo');
  const airtelMapped = mapRawDataToPlans(airtelService?.content?.varations || [], 'airtel');
  const etisalatMapped = mapRawDataToPlans(etisalatService?.content?.varations || [], '9mobile');

  
  return {
     'mtn': mtnMapped,
     'glo': gloMapped,
     '9mobile': etisalatMapped,
     'airtel': airtelMapped,
     isLoading: loadingairtelService || loadingetisalatService || loadinggloService || loadingmtnService
  }
}