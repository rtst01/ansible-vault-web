{{- define "av.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{- define "av.fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end -}}

{{- define "av.labels" -}}
app.kubernetes.io/name: {{ include "av.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "av.backendName" -}}
{{ include "av.fullname" . }}-backend
{{- end -}}

{{- define "av.frontendName" -}}
{{ include "av.fullname" . }}-frontend
{{- end -}}

{{- define "av.allowedOrigins" -}}
{{- if .Values.backend.env.ALLOWED_ORIGINS -}}
{{ .Values.backend.env.ALLOWED_ORIGINS }}
{{- else if .Values.ingress.enabled -}}
{{- if .Values.ingress.tls.enabled -}}
https://{{ .Values.ingress.host }}
{{- else -}}
http://{{ .Values.ingress.host }}
{{- end -}}
{{- else -}}
http://localhost
{{- end -}}
{{- end -}}
