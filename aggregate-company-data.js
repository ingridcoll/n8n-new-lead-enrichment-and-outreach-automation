//Extract data from arrays
const industryRaw = $input.first()?.json?.industries;
const industry = (Array.isArray(industryRaw) ? industryRaw : [])
  .map(industry => {
    return industry?.value || "";
  });

const builtWithTechRaw = $input.first()?.json?.builtwith_tech;
const builtWithTech = (Array.isArray(builtWithTechRaw) ? builtWithTechRaw : [])
  .map(tech => {
    return {
      techName: tech?.name || "",
      techCategory: tech?.technology_category?.[0] || ""
    };
  });

const productsAndServicesRaw = $input.first()?.json?.products_and_services;
const productsAndServices = (Array.isArray(productsAndServicesRaw) ? productsAndServicesRaw : []) 
  .map(product => {
    return {
      "productName": product?.product_name || "",
      "productDescription": product?.product_description || ""
    };
  });

return {
  //Extract data from previous node for the clean domain URL
  "companyDomain": $('Extract Company Domain').first()?.json?.clean_domain || "",
  //Extract enriched data from Crunchbase
  "companyName": $input.first()?.json?.name || "",
  "about": $input.first()?.json?.about || "",
  "description": $input.first()?.json?.full_description || "",
  "industry": String(industry),
  "companyType": $input.first()?.json?.company_type || "",
  "numberOfEmployees": $input.first()?.json?.num_employees || "",
  "country": $input.first()?.json?.country_code || "",
  "email": $input.first()?.json?.contact_email || "",
  "phone": $input.first()?.json?.contact_phone || "",
  "builtWithTech": JSON.stringify(builtWithTech) || "",
  "ipoStatus": $input.first()?.json?.ipo_status || "",
  "monthlyVisits": $input.first()?.json?.monthly_visits || "",
  "productsAndServices": JSON.stringify(productsAndServices),
  "companyEnrichedTimestamp": $input.first()?.json?.timestamp || ""  
}
