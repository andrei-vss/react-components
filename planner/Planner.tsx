import React from "react";
import { Rnd } from "react-rnd";
import Avatar from "react-avatar";

interface PlannerProps {
    lockedSeats: Map<string, Set<number>>;
    tables: any[];
    guests: any[];
    onChange?: () => void;
    onSeatClick?: (tableId: string, seatId: number) => void;
    onTableClick?: (tableId: string) => void;
    onEditTableClick?: (tableId: string) => void;
}

interface PlannerDefaultPositionModel {
    nextPadding: number;
    value: PlannerValueModel;
}

export interface PlannerValueModel {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Planner extends React.Component<PlannerProps, {}> {

    tablesRefs: { [tableId: string]: (Rnd | null) } = {};

    constructor(props: PlannerProps) {
        super(props);

    }

    render(): React.ReactNode {
        let content: JSX.Element[] = [];
        let seatTables: Map<string, any[]> = new Map();
        for (let item of this.props.guests) {
            if (item.tableId != null) {
                let data: any[] | undefined = seatTables.get(item.tableId);
                if (data == null) {
                    data = [];
                }
                data.push(item);
                seatTables.set(item.tableId, data);
            }
        }
        let tables: any[] = this.getStateTables(this.props.tables);
        let padding: number = 0;
        for (let item of tables) {
            let defaultModel: PlannerDefaultPositionModel | undefined = this.getDefaultPosition(item, padding);
            padding = defaultModel.nextPadding;
            content.push(
                <Rnd key={item.id}
                    dragGrid={[20, 20]}
                    lockAspectRatio
                    dragHandleClassName={"moveHandle"}
                    enableResizing={{
                        bottom: false,
                        bottomLeft: false,
                        bottomRight: false,
                        left: false,
                        right: false,
                        top: false,
                        topLeft: false,
                        topRight: false,
                    }}
                    onDragStart={() => this.onChange()}
                    default={defaultModel.value}
                    bounds={"parent"}
                    ref={(c) => this.tablesRefs[item.id] = c}
                >
                    {this.generate(item, seatTables)}
                </Rnd>
            );
        }

        return (
            <div id="div1" style={{ height: "700px", position: "relative" }}>
                <div id="div2" style={{ maxHeight: "100%", maxWidth: "100%", overflow: "auto" }}>
                    <div id="plannerGrid" className={"plannerGrid"} style={{ backgroundSize: "20px 20px", position: "relative", height: "1000px", width: "1220px", border: "5px" }}>
                        <div id={"planner-grids"} style={{
                            backgroundSize: "20px 20px", zIndex: 0,
                            position: "absolute", height: "1000px", width: "1220px", top: 0, left: 0,
                            backgroundImage: "linear-gradient(to right, #f4f2f7 1px, transparent 1px),  linear-gradient(to bottom, #f4f2f7 1px, transparent 1px)"
                        }} />

                        {content}
                    </div>
                </div>
            </div >
        );
    }

    onChange(): void {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    private generate(table: any, seatTables: Map<string, any[]>): JSX.Element | undefined {
        let content: JSX.Element | undefined;
        if (table.type == 1) {
            content = this.generate1(table, seatTables);
        } else if (table.type == 2) {
            content = this.generate2(table, seatTables);
        } else if (table.type == 3) {
            content = this.generate3(table, seatTables);
        } else if (table.type == 4) {
            content = this.generate4(table, seatTables);
        }

        return <div style={{ marginTop: "20px" }}>{content}</div>;;
    }

    private generate4(table: any, seatTables: Map<string, any[]>): JSX.Element | undefined {
        let seatFilled: Map<number, string | undefined> = this.getSeatField(table.id, seatTables);


        let total_num: number = table.maxGuest;
        let c: number = total_num % 4;
        let length1: number = 0;

        let num1: number = 0;
        let num2: number = 0;
        let num3: number = 0;
        let num4: number = 0;

        if (c == 0) {
            num1 = total_num / 4;
            num2 = total_num / 4;
            num3 = total_num / 4;
            num4 = total_num / 4;
        } else if (c == 1) {
            num1 = (total_num - 1) / 4 + 1;
            num2 = (total_num - 1) / 4;
            num3 = (total_num - 1) / 4;
            num4 = (total_num - 1) / 4;
        } else if (c == 2) {
            num1 = (total_num - 2) / 4 + 1;
            num2 = (total_num - 2) / 4 + 1;
            num3 = (total_num - 2) / 4;
            num4 = (total_num - 2) / 4;
        } else {
            num1 = (total_num - 3) / 4 + 1;
            num2 = (total_num - 3) / 4 + 1;
            num3 = (total_num - 3) / 4 + 1;
            num4 = (total_num - 3) / 4;
        }

        length1 = 53 * num1;

        var table_id = 'table' + table.id;

        let topSquareContent: JSX.Element[] = [];
        let leftSquareContent: JSX.Element[] = [];
        let rightSquareContent: JSX.Element[] = [];
        let bottomSquareContent: JSX.Element[] = [];




        for (let j: number = 0; j < num1; j++) {
            let i: number = 1 + j;
            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            topSquareContent.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i + "t"} className={"circlesb"} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }
        for (let j: number = 0; j < num2; j++) {
            let i: number = j + num1 + 1;
            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            leftSquareContent.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i + "l"} className="circles1" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }
        for (let j: number = 0; j < num3; j++) {
            let i: number = j + num1 + num2 + 1;

            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            rightSquareContent.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i + "r"} className="circlesr" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }
        for (let j: number = 0; j < num4; j++) {

            let i: number = j + num1 + num2 + num3 + 1;
            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            bottomSquareContent.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i + "b"} className="circlesb" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }

        let content: JSX.Element = (
            <div style={{ width: "auto", height: "auto", position: "relative" }}>
                <Icon id={"move-trigger"} style={{ cursor: "move", position: "absolute", left: 0, top: "-20px" }} className={"moveHandle"} name={"arrows alternate"} />
                <Icon id={"edit-trigger"} style={{ cursor: "pointer", position: "absolute", left: 20, top: "-20px" }} name={"pencil"} />
                <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div style={{ marginBottom: "-4px", display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center", width: 70 + length1 }}>
                        {topSquareContent}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: 70 + length1 }}>
                        <div style={{ marginRight: -4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            {leftSquareContent}
                        </div>
                        <div onClick={(ev: any) => this.onTableClick(ev, table.id)} style={{ cursor: "pointer", color: "#6D7179", display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "center", alignItems: "center", border: "1px solid #444", width: (length1 - 2), height: (length1 - 2) }} >
                            <Popup basic trigger={<div> {table.alias}</div>}>
                                <Popup.Content>
                                    {table.name}
                                </Popup.Content>
                            </Popup>
                        </div>
                        <div style={{ marginLeft: -4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            {rightSquareContent}
                        </div>
                    </div>
                    <div style={{ marginTop: "-4px", display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center", width: 70 + length1 }}>
                        {bottomSquareContent}
                    </div>
                </div>
            </div>
        );

        return content;
    }


    private generate3(table: any, seatTables: Map<string, any[]>): JSX.Element | undefined {
        let seatFilled: Map<number, string | undefined> = this.getSeatField(table.id, seatTables);


        let total_num: number = table.maxGuest;
        let radius: number = 17.5 + (39 * total_num / 6.28);
        let circle_container_width: number = 2 * radius + (total_num * 8) - 17.5;
        let circle_container_height: number = circle_container_width;

        let tid = table.id;
        let table_id = 'table' + tid.toString();


        let start: number = 90;
        let slice = 360 / total_num;
        let circles: JSX.Element[] = [];
        for (let j: number = 0; j < total_num; j++) {

            let rotate: number = slice * j + start;
            let rotateReverse = rotate * -1;
            let trsfString = 'rotate(' + rotate + 'deg) translate(' + radius + 'px) rotate(' + rotateReverse + 'deg)';

            let i: number = 1 + j;

            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            circles.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i} className="circle-seat" style={{ cursor: "pointer", transform: trsfString, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }


        let content: JSX.Element = (
            <div style={{ width: "auto", height: "auto", position: "relative" }}>
                <Icon id={"move-trigger"} style={{ cursor: "move", position: "absolute", left: 0, top: "-20px" }} className={"moveHandle"} name={"arrows alternate"} />
                <Icon id={"edit-trigger"} style={{ cursor: "pointer", position: "absolute", left: 20, top: "-20px" }} onClick={(ev: any) => this.onEditTableClick(ev, table.id)} name={"pencil"} />
                <div className={"floor-create1"} id={table_id} style={{ width: circle_container_width, height: circle_container_height, }}>
                    <div style={{ position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                        <Popup basic trigger={<div> {table.alias}</div>}>
                            <Popup.Content>
                                {table.name}
                            </Popup.Content>
                        </Popup>
                    </div>
                    <div style={{ cursor: "pointer" }} onClick={(ev) => this.onTableClick(ev, table.id)} className="circ-con">
                        {circles}
                    </div>
                </div >
            </div >
        );
        return content;
    }

    private generate2(table: any, seatTables: Map<string, any[]>): JSX.Element | undefined {
        let seatFilled: Map<number, string | undefined> = this.getSeatField(table.id, seatTables);


        var top_cir_num = table.maxGuest;
        var top_rect_width = 0;
        var tid = table.id;
        var table_id = 'table' + tid.toString();

        top_rect_width = 51 * top_cir_num;

        let topSeat: JSX.Element[] = [];
        for (let j: number = 0; j < top_cir_num; j++) {
            let i: number = 1 + j;

            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            topSeat.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i} className="circles1 link guest-seat-position" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color, margin: "0px 8px", float: "left", opacity: 1 }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }


        var content = (
            <div style={{ width: "auto", height: "auto", position: "relative" }}>
                <Icon id={"move-trigger"} style={{ cursor: "move", position: "absolute", left: 0, top: "-20px" }} className={"moveHandle"} name={"arrows alternate"} />
                <Icon id={"edit-trigger"} style={{ cursor: "pointer", position: "absolute", left: 20, top: "-20px" }} onClick={(ev: any) => this.onEditTableClick(ev, table.id)} name={"pencil"} />
                <div className="table-container" style={{ position: "relative" }} id={table_id}>
                    <div className="top-rect" style={{ marginBottom: "-4px", height: '34px' }}>
                        <div style={{ position: "absolute", width: top_rect_width, top: 4, zIndex: 2 }}>
                            {topSeat}
                        </div>
                    </div>
                    <div className="middle-rect" onClick={(ev: any) => this.onTableClick(ev, table.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: top_rect_width.toString() + 'px', height: '50px' }}>
                        <Popup basic trigger={<div> {table.alias}</div>}>
                            <Popup.Content>
                                {table.name}
                            </Popup.Content>
                        </Popup>
                    </div>
                </div>
            </div >
        );
        return content;
    }

    private generate1(table: any, seatTables: Map<string, any[]>): JSX.Element | undefined {

        let seatFilled: Map<number, string | undefined> = this.getSeatField(table.id, seatTables);


        var total_num = table.maxGuest;
        var top_cir_num = 0;
        var bottom_cir_num = 0;
        var top_rect_width = 0;
        if ((total_num % 2) == 0) {
            top_cir_num = total_num / 2;
            bottom_cir_num = total_num / 2;
        } else {
            bottom_cir_num = (total_num - 1) / 2;
            top_cir_num = bottom_cir_num + 1;
        }
        var tid = table.id;
        var table_id = 'table' + tid.toString();


        top_rect_width = 51 * top_cir_num;

        let topSeat: JSX.Element[] = [];
        for (let j: number = 0; j < top_cir_num; j++) {
            let i: number = 1 + j;
            let color: string | undefined = seatFilled.has(i) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(i)
            }
            topSeat.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, i)} key={table_id + "_" + i} className="circles1 link guest-seat-position" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color, margin: "0px 8px", float: "left", opacity: 1 }} id={table_id + i.toString()}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : i}
                </div>
            );
        }


        let bottomSeat: JSX.Element[] = [];
        for (let j: number = 0; j < bottom_cir_num; j++) {
            let counter: number = top_cir_num + j + 1;
            let color: string | undefined = seatFilled.has(counter) ? "#e0b4b1" : undefined;
            let name: string | undefined;
            if (color != null) {
                name = seatFilled.get(counter);
            }
            bottomSeat.push(
                <div onClick={(ev: any) => this.onSeatClick(ev, table.id, counter)} key={table_id + "_" + j} className="circles1 link guest-seat-position" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color, margin: "0px 8px", float: "left", opacity: 1 }} id={table_id + j.toString() + "b"}>
                    {name != null ? <Avatar round size={"33px"} maxInitials={2} name={name} /> : counter}
                </div>
            );
        }

        var content = (
            <div style={{ width: "auto", height: "auto", position: "relative" }}>
                <Icon id={"move-trigger"} style={{ cursor: "move", position: "absolute", left: 0, top: "-20px" }} className={"moveHandle"} name={"arrows alternate"} />
                <Icon id={"edit-trigger"} style={{ cursor: "pointer", position: "absolute", left: 20, top: "-20px" }} onClick={(ev: any) => this.onEditTableClick(ev, table.id)} name={"pencil"} />
                <div className="table-container" style={{ position: "relative" }} id={table_id}>
                    <div className="top-rect" style={{ marginBottom: "-4px", height: '34px' }}>
                        <div style={{ position: "absolute", top: 4, zIndex: 2 }}>
                            {topSeat}
                        </div>
                    </div>
                    <div className="middle-rect" onClick={(ev: any) => this.onTableClick(ev, table.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: top_rect_width.toString() + 'px', height: '50px' }}>
                        <Popup basic trigger={<div> {table.alias}</div>}>
                            <Popup.Content>
                                {table.name}
                            </Popup.Content>
                        </Popup>
                    </div>
                    <div className="bottom-rect" style={{ height: '34px', marginTop: '-4px' }}>
                        {bottomSeat}
                    </div>
                </div>
            </div >
        );
        return content;
    }


    getValue(): any[] {

        let result: any[] = [];
        for (let item of this.props.tables) {
            let rnd: Rnd | null = this.tablesRefs[item.id];
            if (rnd != null) {
                let position: { x: number, y: number } = rnd.getDraggablePosition();
                let element: HTMLElement | null = rnd.getSelfElement();

                if (element != null) {
                    let domRect: DOMRect = element.getBoundingClientRect();
                    result.push({
                        id: item.id,
                        name: item.name,
                        userId: item.userId,
                        alias: item.alias,
                        type: item.type,
                        maxGuest: item.maxGuest,
                        status: item.status,
                        posX: position.x,
                        posY: position.y,
                        width: domRect.width,
                        height: domRect.height,
                        creationDate: item.creationDate,
                    });
                }
            }
        }

        return result;
    }

    getStateTables(orig: any[]): any[] {
        let result: any[] = JSON.parse(JSON.stringify(orig));
        let padding = 0;
        for (let table of orig) {
            let defaults: PlannerDefaultPositionModel = this.getDefaultPosition(table, padding);
            padding = defaults.nextPadding;
            table.posX = defaults.value.x;
            table.posY = defaults.value.y;
            table.width = defaults.value.width;
            table.height = defaults.value.height;
        }
        return result;
    }

    getDefaultPosition(item: any, padding: number): PlannerDefaultPositionModel {
        let paddingSize: number = 10;

        if (item.posX != null && item.posY != null && item.width != null && item.height != null) {
            return {
                nextPadding: 0, value: {
                    x: item.posX,
                    y: item.posY,
                    width: item.width,
                    height: item.height
                }
            };
        } else {
            if (item.type == 1) {
                let top_cir_num: number = 0;
                if ((item.maxGuest % 2) == 0) {
                    top_cir_num = item.maxGuest / 2;
                } else {
                    top_cir_num = (item.maxGuest + 1) / 2;
                }
                return {
                    nextPadding: padding + paddingSize,
                    value: {
                        x: 20,
                        y: 20 + padding,
                        width: 51 * top_cir_num,
                        height: 137
                    }
                };
            } else if (item.type == 2) {
                let top_cir_num: number = item.maxGuest;
                return {
                    nextPadding: padding + paddingSize,
                    value: {
                        x: 20,
                        y: 20 + padding,
                        width: 51 * top_cir_num,
                        height: 100
                    }
                };
            } else if (item.type == 4) {
                let total_num: number = item.maxGuest;
                let c: number = total_num % 4;
                let length1: number = 0;
                let num1: number = 0;

                if (c == 0) {
                    num1 = total_num / 4;
                } else {
                    num1 = (total_num - 3) / 4 + 1;
                }

                length1 = 53 * num1;
                let width: number = 70 + length1;
                return {
                    nextPadding: padding + paddingSize,
                    value: {
                        x: 20,
                        y: 20 + padding,
                        width: width,
                        height: width + 20
                    }
                };

            } else if (item.type == 3) {
                let radius: number = 17.5 + (39 * item.maxGuest / 6.28);
                let width: number = 2 * radius + (item.maxGuest * 9) - 17.5;
                let height: number = width + 20;
                return {
                    nextPadding: padding + paddingSize,
                    value: {
                        x: 20,
                        y: 20 + padding,
                        width: width,
                        height: height
                    }
                };
            }

            return {
                nextPadding: padding + paddingSize,
                value: {
                    x: 20,
                    y: 20 + paddingSize,
                    width: 50,
                    height: 50
                }
            };
        }
    }


    onSeatClick(ev: any, tableId: string, seatId: number): void {
        ev.stopPropagation();
        if (this.props.onSeatClick != null) {
            this.props.onSeatClick(tableId, seatId);
        }
    }

    onEditTableClick(ev: any, tableId: string): void {
        ev.stopPropagation();
        if (this.props.onEditTableClick != null) {
            this.props.onEditTableClick(tableId);
        }
    }


    onTableClick(ev: any, tableId: string): void {
        ev.stopPropagation();
        if (this.props.onTableClick != null) {
            this.props.onTableClick(tableId);
        }
    }



    private getSeatDisabled(tableId: string): Set<number> {
        return this.props.lockedSeats.get(tableId) || new Set();
    }

    private getSeatField(tableId: string, allSeatTables: Map<string, any[]>): Map<number, string | undefined> {
        let seatFilled: Map<number, string | undefined> = new Map();
        let seatTables: any[] | undefined = allSeatTables.get(tableId);
        if (seatTables != null) {
            for (let item of seatTables) {
                if (item.seat != null) {
                    seatFilled.set(item.seat, item.name + (item.prename != null ? (" " + item.prename) : ""));
                }
            }
        }
        let disabled: Set<number> = this.getSeatDisabled(tableId);
        disabled.forEach(it => seatFilled.set(it, undefined));
        return seatFilled;
    }
}