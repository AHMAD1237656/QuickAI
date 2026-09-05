from rest_framework import serializers


class ToolSerializer(serializers.Serializer):
    slug = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    category = serializers.CharField()


class GenerateRequestSerializer(serializers.Serializer):
    """Validates the payload sent from the frontend when running a tool."""

    tool = serializers.CharField()
    prompt = serializers.CharField(allow_blank=False)
    options = serializers.DictField(required=False, default=dict)


class GenerateResponseSerializer(serializers.Serializer):
    result = serializers.CharField()
    credits_remaining = serializers.IntegerField()
