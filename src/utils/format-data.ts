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
  }

  export const mapRawDataToPlans = (rawData: RawVariation[], network: string): MappedPlan[] => {
    return rawData.map(plan => {
      const planName = plan.name;
  
      // Extract data quantity (e.g., "75GB", "1.5GB", "25MB")
      let dataQtyMatch = planName.match(/(\d+(\.\d+)?)(\s*MB|\s*GB)/i);
      let dataQty = dataQtyMatch ? `${dataQtyMatch[1]} ${dataQtyMatch[3].toUpperCase().trim()}` : "Unknown";
  
      if (dataQty === "Unknown") {
        const fallbackQtyMatch = planName.match(/(\d+(\.\d+)?)/);
        if (fallbackQtyMatch) {
          const numericValue = parseFloat(fallbackQtyMatch[1]);
          dataQty = numericValue < 1000 ? `${numericValue} MB` : `${(numericValue / 1000).toFixed(2)} GB`;
        }
      }
  
      // Extract duration (e.g., "30 Days", "1 Day")
      let durationMatch = planName.match(/(\d+)\s*(hrs|hours|days|weeks|months)/i);
      let duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2].toLowerCase()}` : "Unknown";
  
      // If duration is still unknown, try to match common formats like "1Day" (without space)
      if (duration === "Unknown") {
        const fallbackDurationMatch = planName.match(/(\d+)(day|days|week|weeks|month|months|hr|hrs|hour|hours)/i);
        if (fallbackDurationMatch) {
          duration = `${fallbackDurationMatch[1]} ${fallbackDurationMatch[2].toLowerCase()}`;
        }
      }
  
      const unitPrice = parseFloat(plan.variation_amount);
      const unitCashback = unitPrice * 0.025;
      const interest = 0.04 * unitPrice;
  
      return {
        planId: plan.variation_code,
        dataQty: dataQty,
        duration: duration === 'Unknown' ? "24 hrs" : duration,
        unitPrice: unitPrice > 500 ? unitPrice + interest : unitPrice,
        unitCashback: unitCashback,
        network: network,
        interest: interest
      };
    });
  };
  