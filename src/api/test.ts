import myAxios from "../plugins/myAxios";

export function test(){
    return myAxios({
        url: "/test3",
        method: 'get',
        // headers: {
        //
        //     isRefreshToken: false
        // }

    }


    )
}
