import styles from '@/css/main.module.css'
import IooIIcon from '@/components/icon';

interface IBtnProps {
  text: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const IooIBtn = ({text, icon, onClick, disabled = false}: IBtnProps) => {
  return <button
      className={`${styles.iooi_btn_dark} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={"flex justify-center items-center gap-1"}>
        <p className={"label-xl font-normal w-fit"}>{text}</p>
        {icon ? <IooIIcon size={'sm'} iconPath={icon}/> : null}
      </div>
    </button>
}

export default IooIBtn;
