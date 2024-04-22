import classNames from 'classnames'
import omit from 'lodash/omit'

import './List.css'

type ListProps = (React.HTMLAttributes<HTMLUListElement> | React.HTMLAttributes<HTMLOListElement>) & {
  ordered?: boolean
  depth?: number
}

export default function List(props: ListProps) {
  if (props.ordered) {
    return <ol {...omit(props, ['ordered'])} className={classNames('List', props.className)} />
  } else {
    return <ul {...omit(props, ['ordered'])} className={classNames('List', props.className)} />
  }
}
