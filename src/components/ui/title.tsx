export default function Title({subtitle,title,description}:{subtitle:string,title:string,description:string}) {
    return (
        <>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="text-eyebrow mb-2">{subtitle}</div>
                    <h1 className="font-display text-3xl md:text-4xl text-white">
                        {title}
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        </>
    )
}