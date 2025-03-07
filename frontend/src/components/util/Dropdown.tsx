import {DropdownMenu} from "radix-ui";
import {IconDots} from "@tabler/icons-react";
import {ReactNode} from "react";

interface DropdownProps {
	items: ReactNode[];
	align?: "start" | "end" | "center";
}

export const Dropdown = ({items, align = "start"} : DropdownProps) => {

	return (
		<div className="dropdown">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<button className="Button dropdown-btn">
						<IconDots/>
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content className="dropdown-menu" align={align} collisionPadding={{ top: 30, left: 30, right: 30, bottom: 50 }}>
					{/*<DropdownMenu.Group>*/}
						{items.map((item : ReactNode, index : number) => (
							<DropdownMenu.Item key={"dropdown-item-" + index} className="DropdownMenuItem item">
								{item}
							</DropdownMenu.Item>
						))}
					{/*</DropdownMenu.Group>*/}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}