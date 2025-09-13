import { useRouter } from 'next/router'

const ClickableTableRow = (props: any) => {
  const { pathname, push } = useRouter()

  const id = props?.children?.[0]?.props?.record?.id

  const handleClick = () => {
    if (id) {
      push(`${pathname}/${id}`)
    }
  }

  return (
    <tr
      {...props}
      onClick={handleClick}
      className="hover:bg-black/20 dark:bg-dprimary [&_td]:p-1 cursor-pointer"
    />
  )
}

export default ClickableTableRow
