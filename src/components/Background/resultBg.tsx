interface IProps {
  children: React.ReactNode;
  className?: string
}

const ResultBg = ({children, className}: IProps) => {

  return (
    <div className={`bg-[url(/background/bg_result.svg)] w-screen h-screen bg-cover ${className ?? ""}`}>
      {children}
    </div>
  );
}


export default ResultBg

