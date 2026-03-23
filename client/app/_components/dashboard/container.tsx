'use client'

const Container = ({children}: { children: React.ReactNode}) => {
    return ( 
        <div className="max-w-screen lg:px-24 lg:py-12 px-4 py-6 bg-[#fbfbfb] text-[#3c3c3c] w-full h-full mx-auto flex flex-col gap-4">
            {children}
        </div>
     );
}
 
export default Container;