import styles from '@/css/optimizedResult.module.css'
import IooIIcon from '@/components/OptimizedResult/icon';

interface IBtnProps {
  text: string;
  icon?: string;
  onClick?: () => void;
}

const IooIBtn = ({text, icon, onClick}: IBtnProps) => {
  return <button className={styles.iooi_btn_dark} onClick={onClick}>
      <div className={"flex justify-center items-center gap-1"}>
        <p className={"label-xl font-normal w-fit"}>{text}</p>
        {icon ? <IooIIcon size={'sm'} iconPath={icon}/> : null}
      </div>
    </button>
}

export default IooIBtn;
