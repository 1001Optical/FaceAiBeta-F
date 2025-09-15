interface IProps {
  children: React.ReactNode;
}

const MainBg = ({children}: IProps) => {

  return (
    <div className="bg-[url(/background/bg_main.svg)] w-screen h-screen bg-cover scroll-auto">
        {children}
    </div>
  );
}

// backdrop-filter: blur(30px)

export default MainBg

