import styles from '@/css/main.module.css'
import IooIIcon from '@/components/icon';

interface IBtnProps {
  text: string;
  icon: string;
  onClick?: () => void;
}

const IooIBtn = ({text, icon, onClick}: IBtnProps) => {
  return <button className={styles.iooi_btn_dark} onClick={onClick}>
      <div className={"flex justify-center items-center gap-1"}>
        <p className={"label-xl font-normal w-fit"}>{text}</p>
        <IooIIcon size={'sm'} iconPath={icon}/>
      </div>
    </button>
}

export default IooIBtn;