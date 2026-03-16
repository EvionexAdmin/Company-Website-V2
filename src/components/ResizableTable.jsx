import { useRef, useEffect, useCallback } from 'react'

/**
 * ResizableTable
 *
 * Drop-in replacement for <table> that adds column-resize handles to every <th>.
 * Works with table-layout:fixed — the user drags the right edge of a header cell
 * to widen or narrow it.
 *
 * Usage:  <ResizableTable className="portal-table"> … </ResizableTable>
 */
export default function ResizableTable({ children, className, ...rest }) {
    const tableRef = useRef(null)

    const initResizeHandles = useCallback(() => {
        const table = tableRef.current
        if (!table) return

        const headers = table.querySelectorAll('thead th')
        if (headers.length === 0) return

        // Remove any previously injected handles (in case of re-render)
        table.querySelectorAll('.col-resize-handle').forEach((h) => h.remove())

        headers.forEach((th) => {
            // Make th positioning context
            th.style.position = 'relative'

            const handle = document.createElement('div')
            handle.className = 'col-resize-handle'

            let startX = 0
            let startWidth = 0

            const onMouseMove = (e) => {
                const delta = e.clientX - startX
                const newWidth = Math.max(40, startWidth + delta)
                th.style.width = `${newWidth}px`
            }

            const onMouseUp = () => {
                handle.classList.remove('col-resize-handle--active')
                document.body.style.cursor = ''
                document.body.style.userSelect = ''
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault()
                e.stopPropagation()
                startX = e.clientX
                startWidth = th.offsetWidth
                handle.classList.add('col-resize-handle--active')
                document.body.style.cursor = 'col-resize'
                document.body.style.userSelect = 'none'
                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
            })

            th.appendChild(handle)
        })
    }, [])

    useEffect(() => {
        // Small delay so children are rendered first
        const raf = requestAnimationFrame(initResizeHandles)
        return () => cancelAnimationFrame(raf)
    })

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <table ref={tableRef} className={className} {...rest}>
                {children}
            </table>
        </div>
    )
}
