import pyrebase

config = {
    "apiKey": "AIzaSyDVf4dLtSTUQuocBnN1Xr_D9UfY0QWdINs",
    "authDomain": "tsa2022-2fd1a.firebaseapp.com",
    "databaseURL": "https://tsa2022-2fd1a-default-rtdb.firebaseio.com",
    "projectId": "tsa2022-2fd1a",
    "storageBucket": "tsa2022-2fd1a.appspot.com",
}
firebaseref = pyrebase.initialize_app(config)

data = {
    "garages": {
        "garage1" : {
            "size": "2x2x2",
            "spots": {
                "0x0x0": {
                    "exists": 1,
                    "taken": 0,
                    "handicapped": 0
                },
                "0x0x1": {
                    "exists": 1,
                    "taken": 1,
                    "handicapped": 0
                },
                "0x1x0": {
                    "exists": 1,
                    "taken": 0,
                    "handicapped": 0
                },
                "0x1x1": {
                    "exists": 0,
                    "taken": 0,
                    "handicapped": 0
                }
            }
        }
    }
}

firebaseref.database().child().set(data)