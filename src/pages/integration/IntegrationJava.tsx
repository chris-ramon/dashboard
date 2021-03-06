import * as React from "react";

import { Cell, Grid } from "../../components/Grid";

import { CodeSheet, IntegrationSubPage, IntegrationSubPageProps, IntegrationSubPageState } from "./IntegrationSubPage";

interface IntegrationJavaProps extends IntegrationSubPageProps {
}

interface IntegrationJavaState extends IntegrationSubPageState {
}

export class IntegrationJava extends IntegrationSubPage<IntegrationJavaProps, IntegrationJavaState> {
    render() {
        return (
            <Grid>
                <Cell style={{marginTop: 0}} col={12}>
                    <h4 style={{marginTop: 0}}>Integrating the SDK in to a Java project</h4>
                    <p>To use with Speechlet: </p>
                    <CodeSheet>{
                        `Logless.capture("` + this.state.secretText + `", new HelloWorldSpeechlet());`
                    }</CodeSheet>
                    <p>To use as a standalone servlet: </p>
                    <CodeSheet>{
                        `Servlet wrapper = Logless.capture("` + this.state.secretText + `", new HelloWorldServlet());`
                    }</CodeSheet>
                    <p>Alternatively, you can wrap Servlet endpoints for greater flexibility: </p>
                    <CodeSheet>{
                        `Logless.capture("` + this.state.secretText + `", request, response, new IServletHandler() {` +
                        `\n    public void call() throws IOException, ServletException { ` +
                        `\n            // Main body of servlet processing` +
                        `\n    }` +
                        `\n});`
                    }</CodeSheet>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationJava;

