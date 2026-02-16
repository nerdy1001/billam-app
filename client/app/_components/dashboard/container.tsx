'use client'

const Container = ({children}: { children: React.ReactNode}) => {
    return ( 
        <div className="max-w-screen lg:p-12 px-4 py-6 bg-gray-50 text-[#3c3c3c] w-full h-full mx-auto flex flex-col gap-4">
            {children}
        </div>
     );
}
 
export default Container;