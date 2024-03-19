interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  menu_type: number
  higher_menu_options: Record<string, unknown>[]
  parent_id: number
  title: string
  name: string
  path: string
  component: string
  rank: number
  redirect: string
  icon: string
  extra_icon: string
  enter_transition: string
  leave_transition: string
  active_path: string
  auths: string
  frame_src: string
  frame_loading: boolean
  keep_alive: boolean
  hidden_tag: boolean
  show_link: boolean
  show_parent: boolean
}

interface FormProps {
  model: FormItemProps
}

export type { FormItemProps, FormProps }
