type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center gap-3'>
          <img 
            src='/images/reclamos-logo.png' 
            alt='Reclamos Logo' 
            className='h-12 w-auto object-contain'
          />
          <h1 className='text-xl font-medium'>Reclamos</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
