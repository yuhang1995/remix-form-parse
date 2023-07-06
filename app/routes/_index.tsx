import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from 'zod';

import { parseFormData, parseSearchParams } from "~/utils/parseValues";
// import { BoolAsString } from '~/utils/schemas'

const testSchema = z.object({
    test: z.array(z.object({
        name: z.string(),
        age: z.coerce.number(),
        isFinished: z.array(z.boolean())
    })),
})

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function loader({ request }: LoaderArgs) {
    const parseData = parseSearchParams(request, testSchema)

    return json(parseData)
}

export async function action({ request }: ActionArgs) {

    const parseData = await parseFormData(request, testSchema)

    return json(parseData)
}

export default function Index() {
    const actionData = useActionData<typeof action>()
    const loaderData = useLoaderData<typeof loader>()

    // console.log(zodToJsonSchema(testSchema))

    console.log('loaderData', loaderData)
    console.log('actionData', actionData)

    return (
        <>
            {/* 更改method 为post,将form提交到post中 */}
            <Form method="post" >
                <label>
                    name:
                    <input name="test.0.name" />
                </label>
                <label>
                    age:
                    <input name="test.0.age" />
                </label>
                <label>
                    isFinished:
                    <input name="test.0.isFinished" type="checkbox" value="true" />
                    <input name="test.0.isFinished" type="checkbox" value="true" />
                    <input name="test.0.isFinished" type="checkbox" value="true" />
                    <input name="test.0.isFinished" type="checkbox" value="true" />
                </label>
                <button type="submit">提交</button>
            </Form>
            {/* {JSON.stringify()} */}
        </>
    );
}
