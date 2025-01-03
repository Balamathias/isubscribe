interface RawVariation {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

interface MappedPlan {
  planId: string;
  dataQty: string;
  duration: string;
  unitPrice: number;
  unitCashback: number;
  network: string;
  interest: number;
  planName?: string;
}

export const mapRawDataToPlans = (rawData: RawVariation[], network: string): MappedPlan[] => {
  const dataRegex = /(\d+(\.\d+)?)(\s*MB|\s*GB)/i;
  const durationRegex = /(\d+)\s*(hrs?|hours?|days?|weeks?|months?)/i;
  const fallbackDurationRegex = /(\d+)(day|days|week|weeks|month|months|hr|hrs|hour|hours)/i;

  return rawData.map(plan => {
      const planName = plan.name;

      const dataQtyMatch = planName.match(dataRegex);
      let dataQty = dataQtyMatch
          ? `${dataQtyMatch[1]} ${dataQtyMatch[3].toUpperCase().trim()}`
          : "Unknown";

      if (dataQty === "Unknown") {
          const fallbackQtyMatch = planName.match(/(\d+(\.\d+)?)/);
          if (fallbackQtyMatch) {
              const numericValue = parseFloat(fallbackQtyMatch[1]);
              dataQty = numericValue < 1000
                  ? `${numericValue} MB`
                  : `${(numericValue / 1000).toFixed(2)} GB`;
          }
      }

      const durationMatch = planName.match(durationRegex);
      let duration = durationMatch
          ? `${durationMatch[1]} ${durationMatch[2].toLowerCase()}`
          : "Unknown";

      if (duration === "Unknown") {
          const fallbackDurationMatch = planName.match(fallbackDurationRegex);
          if (fallbackDurationMatch) {
              duration = `${fallbackDurationMatch[1]} ${fallbackDurationMatch[2].toLowerCase()}`;
          }
      }

      const unitPrice = parseFloat(plan.variation_amount);
      const unitCashback = Math.round(unitPrice * 0.004);
      const interest = Math.round(0.1 * unitPrice);

      return {
          planId: plan.variation_code,
          dataQty: dataQty,
          duration: duration === 'Unknown' ? "-" : duration,
          unitPrice,
          unitCashback: unitCashback,
          network: network,
          interest: 0,
          planName,
      };
  });
};
