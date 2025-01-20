import style from './style.module.scss';

type ErrorProps = {
  error: string;
}

export function ErrorUI ({ error }: ErrorProps) {
  return <div className={style.error}>Ошибка: {error}</div>;
}