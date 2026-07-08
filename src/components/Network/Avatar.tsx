interface AvatarProps {
  image?: string;
  name: string;
}


export default function Avatar({
  image,
  name,
}: AvatarProps) {


  const initials = name
    ?.split(" ")
    .map((item)=>item.charAt(0))
    .join("")
    .slice(0,2)
    .toUpperCase();


  return (
    <div className="w-12 h-12 rounded-full border border-[#8a6a22] bg-[#111] flex items-center justify-center overflow-hidden shrink-0">
      
      {
        image ? (
          <img src={image} alt={name} className="w-full h-full object-cover"/>
        )
        :
        (
          <span className="text-[#c9a227] text-sm font-medium">
            {initials}
          </span>
        )
      }

    </div>
  );
}