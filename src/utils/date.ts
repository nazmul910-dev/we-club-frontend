export function calculateTenure(createdAt:string){

  const startDate = new Date(createdAt);

  const currentDate = new Date();


  const diffTime =
    currentDate.getTime() - startDate.getTime();


  const totalDays =
    Math.floor(diffTime / (1000 * 60 * 60 * 24));



  const years =
    Math.floor(totalDays / 365);



  const remainingDays =
    totalDays % 365;



  if(years === 0){

    return `${remainingDays} days`;

  }



  if(remainingDays === 0){

    return `${years} ${years === 1 ? "year":"years"}`;

  }



  return `${years} ${years === 1 ? "year":"years"} ${remainingDays} days`;

}