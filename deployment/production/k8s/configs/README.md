## Create configMapKeyRef and secretKeyRef

configMapKeyRef

```bash
kubectl create configmap arcadia-stage --from-env-file .\arcadia-stage.properties
```

secretKeyRef

```bash
kubectl create secret generic arcadia-stage --from-env-file .\secrets-arcadia-stage.yaml
```

## Delete

```bash
kubectl delete configmaps arcadia-stage
kubectl delete secret arcadia-stage
```
