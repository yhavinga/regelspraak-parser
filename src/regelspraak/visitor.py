"""RegelSpraak parse tree visitor that builds model objects."""
from typing import Dict, List, Optional

from .model import Domain, ObjectType, Rule
from .generated.RegelSpraakParser import RegelSpraakParser
from .generated.RegelSpraakVisitor import RegelSpraakVisitor

class RegelSpraakModelBuilder(RegelSpraakVisitor):
    """Visitor that builds model objects from a RegelSpraak parse tree."""

    def visitDomain(self, ctx: RegelSpraakParser.DomainContext) -> Domain:
        """Visit a domain node and build a Domain object.
        
        Args:
            ctx: Domain context from the parse tree
            
        Returns:
            Domain object containing the parsed object types and rules
        """
        name = ctx.IDENTIFIER().getText()
        description = None
        if ctx.description():
            description = ctx.description().STRING().getText()[1:-1]  # Remove quotes
            
        object_types = []
        rules = []
        
        for child in ctx.getChildren():
            if isinstance(child, RegelSpraakParser.ObjectTypeContext):
                object_types.append(self.visitObjectType(child))
            elif isinstance(child, RegelSpraakParser.RuleContext):
                rules.append(self.visitRule(child))
                
        return Domain(
            name=name,
            description=description,
            object_types=object_types,
            rules=rules
        )

    def visitObjectType(self, ctx: RegelSpraakParser.ObjectTypeContext) -> ObjectType:
        """Visit an object type node and build an ObjectType object.
        
        Args:
            ctx: ObjectType context from the parse tree
            
        Returns:
            ObjectType object containing the parsed attributes
        """
        name = ctx.IDENTIFIER().getText()
        description = None
        if ctx.description():
            description = ctx.description().STRING().getText()[1:-1]
            
        attributes = {}
        for attr in ctx.attribute():
            attr_name = attr.IDENTIFIER().getText()
            attr_type = attr.type_().getText()
            attributes[attr_name] = attr_type
            
        return ObjectType(
            name=name,
            description=description,
            attributes=attributes
        )

    def visitRule(self, ctx: RegelSpraakParser.RuleContext) -> Rule:
        """Visit a rule node and build a Rule object.
        
        Args:
            ctx: Rule context from the parse tree
            
        Returns:
            Rule object containing the parsed condition and consequence
        """
        name = ctx.IDENTIFIER().getText()
        description = None
        if ctx.description():
            description = ctx.description().STRING().getText()[1:-1]
            
        condition = ctx.condition().getText()
        consequence = ctx.consequence().getText()
        
        metadata = {}
        if ctx.metadata():
            for meta in ctx.metadata().metaAttribute():
                meta_name = meta.IDENTIFIER().getText()
                meta_value = meta.STRING().getText()[1:-1]
                metadata[meta_name] = meta_value
                
        return Rule(
            name=name,
            description=description,
            condition=condition,
            consequence=consequence,
            metadata=metadata
        ) 