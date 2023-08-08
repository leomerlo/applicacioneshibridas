import { PropsWithChildren } from 'react'

const HeadDivider = (props: PropsWithChildren) => {
  return (
    <div className="mt-8 bg-dividerLineBlocks py-6">
      { props.children }
    </div>
  )
}

export default HeadDivider