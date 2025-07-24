import React from 'react'

type BugDetailModalProps = {
  bug: {
    id: number,
    name: string,
    description: string | null,
    client?: {id: string, name: string}
  };
  onClose: () => void;
}
const BugDetail = () => {
  return (
    <div>BugDetail</div>
  )
}

export default BugDetail