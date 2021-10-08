# grpc-trial

## setup environment

Setup python environment using `requirements.txt` as below.

```sh
# create virtual environment (first time only)
python -m venv venv
pip install -r requirements.txt

# activate
source venv/bin/activate
```

## generate files by protoc

```sh
python -m grpc_tools.protoc -I protos --python_out=. --grpc_python_out=. --mypy_out=. --mypy_grpc_out=. protos/calculator.proto
```

## run

### server

```sh
python -m convex_hull_calculator_servicer
```

### client

```sh
python -m convex_hull_calculator_client
```
