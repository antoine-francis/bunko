import {DropdownMenu} from "radix-ui";
import {IconDots} from "@tabler/icons-react";
import {ReactNode} from "react";

interface DropdownProps {
	items: ReactNode[];
}

export const Dropdown = ({items} : DropdownProps) => {

	return (
		<div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<button className="Button violet">
						<IconDots/>
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content className="dropdown-menu" align="start" collisionPadding={{ top: 30, left: 30, right: 30, bottom: 50 }}>
					<DropdownMenu.Separator className="DropdownMenuSeparator" />

					<DropdownMenu.Group>
						{items.map((item : ReactNode, index : number) => (
							<DropdownMenu.Item key={"dropdown-item-" + index} className="DropdownMenuItem item">
								{item}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}