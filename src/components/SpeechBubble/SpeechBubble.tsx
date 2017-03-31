import * as React from "react";

interface BlockQuoteStyle {
    borderColor: string;
}

interface SpeechBubbleProps {
    text: string;
    cite?: string;
    blockStyle?: BlockQuoteStyle;
}

interface SpeechBubbleState {

}


// .triangle-isosceles.left {
//   margin-left: 50px;
//   background: #f3961c;
// }

// .triangle-obtuse.left {
//   margin-left: 50px;
//   background: #c81e2b;
// }

// .triangle-border.left {
//   margin-left: 30px;
// }
export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {

    static contentStyle: React.CSSProperties = {
        position: "relative",
        zIndex: 1
    };

    static boxIsosceles: React.CSSProperties = {
        position: "relative",
        padding: "15px",
        margin: "1em 0 3em",
        color: "#000",
        borderRadius: "10px",
        background: "#f3961c"
    };

    static triangleLeftBottomPosition: React.CSSProperties = {
        display: "block", /* reduce the damage in FF3.0 */
        position: "absolute",
        bottom: "-15px",
        left: "50px",
    };

    static triangleIsosceles: React.CSSProperties = {
        content: "",
        width: 0,
        borderWidth: "15px 15px 0",
        borderStyle: "solid",
        borderColor: "#f3961c transparent"
    };

    render() {
        const { text, cite, blockStyle } = this.props;
        const containerStyle = { ...SpeechBubble.contentStyle };
        const trianglePosition = { ...SpeechBubble.triangleLeftBottomPosition };
        const beforeStyle: any = undefined;
        const afterStyle = { ...SpeechBubble.triangleIsosceles };
        const quoteStyle = { ...SpeechBubble.boxIsosceles, ...blockStyle };
        console.log(containerStyle);
        console.log(quoteStyle);
        console.log(afterStyle);
        return (
            <div style={containerStyle}>
                <blockquote style={quoteStyle}>
                    <p>{text}</p>
                    {(cite) ? <cite>{cite}</cite> : undefined}
                </blockquote>
                <div style={trianglePosition} >
                    <div style={beforeStyle} />
                    <div style={afterStyle} />
                </div>
            </div>
        );
    }
}

export default SpeechBubble;

// /* Bubble with an isoceles triangle
// ------------------------------------------ */

// .triangle-obtuse {
//   position: relative;
//   padding: 15px;
//   margin: 1em 0 3em;
//   color: #fff;
//   background: #c81e2b;
//   background: linear-gradient(#f04349, #c81e2b);
//   border-radius: 10px;
// }

// .triangle-border {
//   position: relative;
//   padding: 15px;
//   margin: 1em 0 3em;
//   border: 10px solid #5a8f00;
//   color: #333;
//   border-radius: 30px;
// }

// /* Variant : for left/right positioned triangle
// ------------------------------------------ */

// .triangle-isosceles.left {
//   margin-left: 50px;
//   background: #f3961c;
// }

// .triangle-obtuse.left {
//   margin-left: 50px;
//   background: #c81e2b;
// }

// .triangle-border.left {
//   margin-left: 30px;
// }

// /* Variant : for right positioned triangle
// ------------------------------------------ */

// .triangle-isosceles.right {
//   margin-right: 50px;
//   background: #f3961c;
// }

// .triangle-obtuse.right {
//   margin-right: 50px;
//   background: #c81e2b;
// }

// .triangle-border.right {
//   margin-right: 30px;
// }

// /*-------------------------- TRIANGLE -------------------------------*/
// .triangle-isosceles:after {
//   content: "";
//   display: block; /* reduce the damage in FF3.0 */
//   position: absolute;
//   bottom: -15px;
//   left: 50px;
//   width: 0;
//   border-width: 15px 15px 0;
//   border-style: solid;
//   border-color: #f3961c transparent;
// }

// /* creates the wider right-angled triangle */
// .triangle-obtuse:before {
//   content: "";
//   position: absolute;
//   bottom: -50px; /* value = - border-top-width - border-bottom-width */
//   left: 60px; /* controls horizontal position */
//   border: 0;
//   border-right-width: 50px; /* vary this value to change the angle of the vertex */
//   border-bottom-width: 60px; /* vary this value to change the height of the triangle. must be equal to the corresponding value in :after */
//   border-style: solid;
//   border-color: transparent #c81e2b;
//   /* reduce the damage in FF3.0 */
//   display: block;
//   width: 0;
// }

// /* creates the narrower right-angled triangle which covers up part of the big one.  Creates an illusion of obtuse. */
// .triangle-obtuse:after {
//   content: "";
//   position: absolute;
//   bottom: -60px; /* value = - border-top-width - border-bottom-width */
//   left: 95px; /* value = (:before's left) + (:before's border-right/left-width)  - (:after's border-right/left-width) */
//   border: 0;
//   border-right-width: 20px; /* vary this value to change the angle of the vertex */
//   border-bottom-width: 60px; /* vary this value to change the height of the triangle. must be equal to the corresponding value in :before */
//   border-style: solid;
//   border-color: transparent #fff;
//   /* reduce the damage in FF3.0 */
//   display: block;
//   width: 0;
// }

// .triangle-border:before {
//   content: "";
//   position: absolute;
//   bottom: -50px; /* value = - border-top-width - border-bottom-width */
//   left: 60px; /* controls horizontal position */
//   border: 0;
//   border-right-width: 60px; /* vary this value to change the angle of the vertex */
//   border-bottom-width: 50px; /* vary this value to change the height of the triangle. must be equal to the corresponding value in :after */
//   border-style: solid;
//   border-color:  transparent #5a8f00;
//   display: block;
//   width: 0;
// }

// .triangle-border:after {
//   content: "";
//   position: absolute;
//   bottom: -30px;
//   left: 65px;
//   border: 0;
//   border-right-width: 45px;
//   border-bottom-width: 40px;
//   border-style: solid;
//   border-color:  transparent #fff;
//   display: block;
//   width: 0;
// }

// /* Variant : left
// ------------------------------------------ */

// .triangle-isosceles.left:after {
//   top:16px; /* controls vertical position */
//   left:-50px; /* value = - border-left-width - border-right-width */
//   bottom:auto;
//   border-width:10px 50px 10px 0;
//   border-color:transparent #f3961c;
// }

// .triangle-obtuse.left:before {
//   top: 15px; /* controls vertical position */
//   bottom: auto;
//   left: -50px; /* value = - border-left-width - border-right-width */
//   border: 0;
//   border-bottom-width: 30px; /* vary this value to change the height of the triangle */
//   border-left-width: 90px; /* vary this value to change the width of the triangle. must be equal to the corresponding value in :after */
//   border-color: #f3961c transparent;
// }

// .triangle-obtuse.left:after {
//   top: 35px; /* value = (:before's top) + (:before's border-top/bottom-width)  - (:after's border-top/bottom-width) */
//   bottom: auto;
//   left: -50px; /* value = - border-left-width - border-right-width */
//   border: 0;
//   border-bottom-width: 30px; /* vary this value to change the height of the triangle */
//   border-left-width: 90px; /* vary this value to change the width of the triangle. must be equal to the corresponding value in :before */
//   border-color:#f3961c transparent;
// }

// .triangle-border.left:before {
//   top: 10px; /* controls vertical position */
//   bottom: auto;
//   left: -30px; /* value = - border-left-width - border-right-width */
//   border-width: 15px 30px 15px 0;
//   border-color: transparent #5a8f00;
// }

// .triangle-border.left:after {
//   top: 16px; /* value = (:before top) + (:before border-top) - (:after border-top) */
//   bottom: auto;
//   left: -21px; /* value = - border-left-width - border-right-width */
//   border-width: 9px 21px 9px 0;
//   border-color: transparent #fff;
// }

// /* Variant : right
// ------------------------------------------ */

// .triangle-isosceles.right:after {
//   top:16px; /* controls vertical position */
//   right:-50px; /* value = - border-left-width - border-right-width */
//   bottom:auto;
//   left:auto;
//   border-width:10px 0 10px 50px;
//   border-color:transparent #f3961c;
// }

// .triangle-obtuse.right:before {
//   top: 15px; /* controls vertical position */
//   bottom: auto;
//   left: auto;
//   right: -50px; /* value = - border-left-width - border-right-width */
//   border: 0;
//   border-bottom-width: 30px; /* vary this value to change the height of the triangle */
//   border-right-width: 50px; /* vary this value to change the width of the triangle. must be equal to the corresponding value in :after */
//   border-color: #f3961c transparent;
// }